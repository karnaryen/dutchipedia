#!/usr/bin/env python3
"""Re-encode the images under content/words/ as WebP.

fetch-word-images.py saves what Commons serves: a JPEG for a photograph, a PNG
for anything it rendered from an SVG. The PNGs are the heavy ones — a shaded
drawing at 800px runs to 200 KB and more — and the repository carries every
one of them for good. WebP holds both kinds, keeps transparency, and comes to
about a third of the size.

next/image re-encodes for the visitor either way, so this is about the weight
of the repository and the build, not of the page.

Run it after fetch-word-images.py and before generate-word-data.py: it records
the new extension in credits.json, which is where the data generator reads it.
Images that are already WebP are left alone, so it is safe to run again.

Setup (once):
    pip3 install --user Pillow

Usage:
    python3 scripts/compress-word-images.py
"""

import json
import sys

from PIL import Image

from word_topics import CONTENT

# Where the artefacts stop being visible at the card's size; a drawing gets a
# little more than a photograph because its flat fields show ringing sooner.
QUALITY = {".png": 82, ".jpg": 80}


def main() -> int:
    before = after = converted = 0
    missing = []

    for manifest_path in sorted(CONTENT.rglob("credits.json")):
        folder = manifest_path.parent
        manifest = json.loads(manifest_path.read_text())

        for slug, credit in manifest.items():
            source = folder / f"{slug}.{credit.get('extension', 'jpg')}"
            if not source.exists():
                missing.append(str(source.relative_to(CONTENT)))
                continue
            if source.suffix == ".webp":
                continue

            target = source.with_suffix(".webp")
            with Image.open(source) as image:
                # Palette and greyscale-with-alpha PNGs both come through
                # RGBA; WebP has no mode of its own for either.
                mode = "RGB" if source.suffix == ".jpg" else "RGBA"
                image.convert(mode).save(
                    target, "WEBP", quality=QUALITY[source.suffix], method=6
                )

            before += source.stat().st_size
            after += target.stat().st_size
            converted += 1
            source.unlink()
            credit["extension"] = "webp"
            credit["bytes"] = target.stat().st_size

        # Trailing newline: Prettier checks this file and counts its absence.
        manifest_path.write_text(
            json.dumps(manifest, indent=2, ensure_ascii=False, sort_keys=True) + "\n"
        )

    print(f"{converted} images, {before // 1024} KB -> {after // 1024} KB")
    if missing:
        print(f"\n{len(missing)} in a manifest but not on disk:")
        for path in missing:
            print(f"  {path}")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
