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
    python3 scripts/fetch-word-images.py cats --only selkirk-rex

Three things bite here, all handled below:
  * Wikipedia appends "?utm_source=..." to image URLs, which corrupts the file
    name used for the Commons lookup.
  * Some lead images are already thumbnails, named "800px-Foo.jpg"; the Commons
    original is "Foo.jpg".
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

UA = "Dutchipedia/1.0 (learning-project dev setup)"
# The words live in the woordenschat zone, not at the repo root.
ROOT = pathlib.Path(__file__).resolve().parent.parent / "apps" / "woordenschat"
CONTENT = ROOT / "content" / "words"

# Above this, re-request a narrower thumbnail — a handful of photographs are
# detailed enough to weigh close to a megabyte at 800px.
MAX_BYTES = 300_000
WIDE, NARROW = 800, 600

TOPICS_PATH = pathlib.Path(__file__).resolve().parent / "word-topics.json"


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
        file_name = re.sub(r"^\d+px-", "", file_name)

    time.sleep(1.1)
    info = image_info("commons.wikimedia.org", file_name, WIDE)
    if "thumburl" not in info:
        # Not on Commons — the file is local to English Wikipedia.
        time.sleep(1.1)
        info = image_info("en.wikipedia.org", file_name, WIDE)
    if "thumburl" not in info:
        raise RuntimeError(f"no thumbnail for {file_name}")

    time.sleep(1.1)
    blob = get(info["thumburl"])
    if len(blob) > MAX_BYTES:
        time.sleep(1.1)
        narrow = image_info("commons.wikimedia.org", file_name, NARROW)
        if "thumburl" in narrow:
            blob = get(narrow["thumburl"])

    (CONTENT / topic / f"{slug}.jpg").write_bytes(blob)
    meta = info.get("extmetadata", {})
    return {
        "file": file_name,
        "bytes": len(blob),
        "artist": strip_markup(meta.get("Artist", {}).get("value"))[:70]
        or "Wikimedia Commons contributor",
        "license": strip_markup(meta.get("LicenseShortName", {}).get("value")) or "see source",
        # CC BY and CC BY-SA both require the licence to be linked, not just
        # named, so the URL is part of the credit rather than a nicety.
        "licenseUrl": strip_markup(meta.get("LicenseUrl", {}).get("value")),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("topics", nargs="+")
    parser.add_argument("--only", help="limit to a single slug")
    args = parser.parse_args()

    definitions = json.loads(TOPICS_PATH.read_text())
    failures = []

    for topic in args.topics:
        entries = definitions[topic]["words"]
        (CONTENT / topic).mkdir(parents=True, exist_ok=True)
        manifest_path = CONTENT / topic / "credits.json"
        manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}

        for entry in entries:
            if args.only and entry["slug"] != args.only:
                continue
            try:
                info = fetch_one(entry["article"], entry["slug"], topic, entry.get("file"))
                manifest[entry["slug"]] = info
                print(f"OK   {topic}/{entry['slug']:24} {info['bytes'] // 1024:>4}KB  {info['license']}")
            except Exception as error:  # noqa: BLE001 - report and keep going
                failures.append((topic, entry["slug"], str(error)[:70]))
                print(f"FAIL {topic}/{entry['slug']:24} {error}")
            time.sleep(1.1)

        manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False, sort_keys=True))

    if failures:
        print(f"\n{len(failures)} failed:")
        for topic, slug, error in failures:
            print(f"  {topic}/{slug}: {error}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
