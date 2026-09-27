#!/usr/bin/env python3
"""Download the photographs behind content/words/<topic>/ from Wikipedia.

Takes the lead image of each English Wikipedia article, resolves it back to its
Wikimedia Commons (or local English Wikipedia) file page to read the licence,
and saves a resized copy next to the topic's data file.

Licence metadata is not optional decoration: most of these photos are CC BY or
CC BY-SA, where attribution is a condition of use. The manifest this writes is
what content/words/<topic>/<topic>.ts quotes in its `credit` fields.

Usage:
    python3 scripts/fetch-word-images.py cats dogs trees
    python3 scripts/fetch-word-images.py cats --only selkirk-rex munchkin
    python3 scripts/fetch-word-images.py body/senses     one topic of a section
    python3 scripts/fetch-word-images.py body --missing  only words with no image yet

Four things bite here, all handled below:
  * Wikipedia appends "?utm_source=..." to image URLs, which corrupts the file
    name used for the Commons lookup.
  * Some lead images are already thumbnails, named "800px-Foo.jpg"; the Commons
    original is "Foo.jpg".
  * Anything Commons cannot serve directly is rendered on the way out, and the
    rendered format is appended to the name: "Foo.svg" becomes "Foo.svg.png",
    "Foo.tif" becomes "lossy-page1-800px-Foo.tif.jpg". Half the anatomy
    articles lead with an SVG diagram, so this is the common case, not an edge
    one — and the file we save is then a PNG, which is why the manifest records
    the extension for the data generator to import.
  * A few files live on English Wikipedia rather than Commons, so the Commons
    query comes back empty and we have to ask enwiki instead.
"""

from __future__ import annotations  # `str | None` annotations on Python 3.9

import argparse
import html
import json
import pathlib
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

from word_topics import CONTENT, select

UA = "Dutchipedia/1.0 (learning-project dev setup)"

# Above this, re-request a narrower thumbnail — a detailed photograph or a
# busy diagram can weigh a megabyte or more at 800px.
MAX_BYTES = 300_000
# Commons serves the original file unchanged when the width asked for is close
# to the original's, however heavy that file is, so one narrower retry is not
# enough: keep stepping down until it actually renders a thumbnail. 400px is
# the floor — the card paints 260 CSS px, so that still covers a 1.5× screen.
WIDTHS = (800, 600, 500, 400)

# next/image only derives a blur placeholder for a still jpg, png, webp or
# avif, and the cards all ask for one. A GIF — which on Commons usually means
# an animation — would build to a missing blurDataURL, so refuse it here and
# let the entry pin a still instead.
USABLE = {".jpg", ".jpeg", ".png", ".webp", ".avif"}

# Formats Commons renders to PNG or JPEG before serving, so their thumbnail
# names carry two extensions. See the note at the top of this file.
RENDERED = re.compile(r"(?i)^(?P<original>.+\.(?:svg|tiff?|pdf|djvu|xcf))\.(?:png|jpe?g)$")


def get(url: str, tries: int = 6) -> bytes:
    for attempt in range(tries):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(request, timeout=45) as response:
                return response.read()
        except urllib.error.HTTPError as error:
            if error.code in (429, 503) and attempt < tries - 1:
                time.sleep(4 * (attempt + 1))
                continue
            raise
    raise RuntimeError("unreachable")


def strip_markup(value: str | None) -> str:
    """HTML to a single clean line.

    Commons credit fields are free-form HTML and some carry line breaks —
    camera settings, derivative-work notes. Collapsing whitespace keeps them
    from turning into unterminated string literals downstream.
    """
    text = html.unescape(re.sub(r"<[^>]+>", "", value or ""))
    return re.sub(r"\s+", " ", text).strip()


def artist(value: str | None) -> str:
    """The author line of a credit, from the Commons "Artist" field.

    That field is free text and carries more than a name: Blausen's uploads
    append a paragraph on how to cite them, a missing author is rendered
    twice, once for screen readers, and some authors say in it how they want
    to be credited. Cutting blindly at 70 characters kept half of those
    sentences in the credit, so drop them, then shorten on a word.
    """
    text = strip_markup(value)
    asked = re.search(r'Please credit as "([^"]+)"', text)
    if asked:
        return asked.group(1)
    text = re.split(r"\.? When using this image", text)[0]
    text = re.sub(r"^(Unknown author)+$", "Unknown author", text)
    text = re.sub(r"^No machine-readable author provided\. (\S+) assumed.*$", r"\1", text)
    text = re.sub(r"\s*\[\d+\]", "", text).strip()
    if len(text) > 70:
        text = text[:70].rsplit(" ", 1)[0].rstrip(",;:") + "…"
    return text or "Wikimedia Commons contributor"


def image_info(host: str, file_name: str, width: int) -> dict:
    api = (
        f"https://{host}/w/api.php?action=query&format=json&prop=imageinfo"
        f"&iiprop=extmetadata%7Curl&iiurlwidth={width}&titles="
        + urllib.parse.quote("File:" + file_name)
    )
    page = next(iter(json.loads(get(api))["query"]["pages"].values()))
    return (page.get("imageinfo") or [{}])[0]


def fetch_one(article: str, slug: str, topic: str, pinned: str | None = None) -> dict:
    if pinned:
        # An entry can name a Commons file directly when the article's lead
        # image is unusable — a licence we do not want, or a bad crop.
        file_name = pinned
    else:
        summary = json.loads(
            get(f"https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(article)}")
        )
        source = (summary.get("originalimage") or summary.get("thumbnail") or {}).get("source")
        if not source:
            raise RuntimeError("article has no lead image")

        file_name = urllib.parse.unquote(source.split("?")[0].rsplit("/", 1)[-1])
        # "lossy-page1-800px-Foo.tif.jpg" -> "Foo.tif": strip the page selector,
        # then the width, then the format Commons rendered it to.
        file_name = re.sub(r"^(?:lossy-|lossless-)?page\d+-", "", file_name)
        file_name = re.sub(r"^\d+px-", "", file_name)
        rendered = RENDERED.match(file_name)
        if rendered:
            file_name = rendered.group("original")

    host = "commons.wikimedia.org"
    time.sleep(1.1)
    info = image_info(host, file_name, WIDTHS[0])
    if "thumburl" not in info:
        # Not on Commons — the file is local to English Wikipedia.
        host = "en.wikipedia.org"
        time.sleep(1.1)
        info = image_info(host, file_name, WIDTHS[0])
    if "thumburl" not in info:
        raise RuntimeError(f"no thumbnail for {file_name}")

    time.sleep(1.1)
    thumb_url = info["thumburl"]
    blob = get(thumb_url)
    for width in WIDTHS[1:]:
        if len(blob) <= MAX_BYTES:
            break
        time.sleep(1.1)
        narrower = image_info(host, file_name, width)
        if "thumburl" not in narrower:
            break
        thumb_url = narrower["thumburl"]
        time.sleep(1.1)
        blob = get(thumb_url)

    # An SVG diagram comes back as a PNG. Saving that as .jpg would leave the
    # file lying about its contents, so take the extension from what we got.
    extension = pathlib.PurePosixPath(urllib.parse.urlparse(thumb_url).path).suffix.lower()
    extension = {".jpeg": ".jpg", "": ".jpg"}.get(extension, extension)
    if extension not in USABLE:
        raise RuntimeError(f"{file_name} is {extension} — pin a still jpg or png instead")
    for stale in (CONTENT / topic).glob(f"{slug}.*"):
        # A re-fetch can change the format; two files for one slug would leave
        # the data generator importing whichever it guessed.
        if stale.suffix != extension:
            stale.unlink()
    (CONTENT / topic / f"{slug}{extension}").write_bytes(blob)
    meta = info.get("extmetadata", {})
    return {
        "file": file_name,
        "extension": extension.lstrip("."),
        "bytes": len(blob),
        "artist": artist(meta.get("Artist", {}).get("value")),
        "license": strip_markup(meta.get("LicenseShortName", {}).get("value")) or "see source",
        # CC BY and CC BY-SA both require the licence to be linked, not just
        # named, so the URL is part of the credit rather than a nicety.
        "licenseUrl": strip_markup(meta.get("LicenseUrl", {}).get("value")),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("topics", nargs="+")
    parser.add_argument("--only", nargs="+", metavar="SLUG", help="limit to these slugs")
    parser.add_argument("--missing", action="store_true", help="skip words that have an image")
    args = parser.parse_args()

    failures = []

    for topic, definition in select(args.topics).items():
        entries = definition["words"]
        (CONTENT / topic).mkdir(parents=True, exist_ok=True)
        manifest_path = CONTENT / topic / "credits.json"
        manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}

        for entry in entries:
            if args.only and entry["slug"] not in args.only:
                continue
            if args.missing and entry["slug"] in manifest:
                continue
            try:
                info = fetch_one(entry["article"], entry["slug"], topic, entry.get("file"))
                # Commons does not always know the author, or buries the
                # name in a history of who cropped what. An entry can state it.
                if "author" in entry:
                    info["artist"] = entry["author"]
                manifest[entry["slug"]] = info
                print(f"OK   {topic}/{entry['slug']:24} {info['bytes'] // 1024:>4}KB  {info['license']}")
            except Exception as error:  # noqa: BLE001 - report and keep going
                failures.append((topic, entry["slug"], str(error)[:70]))
                print(f"FAIL {topic}/{entry['slug']:24} {error}")
            time.sleep(1.1)

        # Trailing newline: Prettier checks this file and counts its absence.
        manifest_path.write_text(
            json.dumps(manifest, indent=2, ensure_ascii=False, sort_keys=True) + "\n"
        )

    if failures:
        print(f"\n{len(failures)} failed:")
        for topic, slug, error in failures:
            print(f"  {topic}/{slug}: {error}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
