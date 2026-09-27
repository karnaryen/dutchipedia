#!/usr/bin/env python3
"""Generate the Dutch pronunciation clips served from public/audio/words.

Browser speech synthesis was unreliable: the phrase came out in an English
voice for anyone without a Dutch voice installed. These clips are generated
once, committed, and played as plain audio files, so every visitor hears the
same thing.

Voice: piper nl_NL-ronnie-medium. Its dataset is CC0, so the generated audio
carries no attribution requirement.

Usage:
    pip3 install --user piper-tts
    python3 -m piper.download_voices nl_NL-ronnie-medium --data-dir .voices
    python3 scripts/generate-pronunciations.py

The phrases come from scripts/word-topics.json, the same file the images and
the data files are built from, so there is one list to keep correct. Existing
clips are left alone unless --force is passed.
"""

from __future__ import annotations

import argparse
import pathlib
import shutil
import subprocess
import sys
import tempfile

from word_topics import AUDIO as DEST
from word_topics import REPO, topics

VOICE = REPO / ".voices" / "nl_NL-ronnie-medium.onnx"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="regenerate clips that already exist")
    args = parser.parse_args()

    if not VOICE.exists():
        print(f"Voice model missing: {VOICE}\nSee the usage note at the top of this file.")
        return 1
    if not shutil.which("afconvert"):
        print("afconvert not found — this script uses the macOS AAC encoder.")
        return 1

    made = skipped = 0
    with tempfile.TemporaryDirectory() as tmp:
        for topic, definition in topics().items():
            (DEST / topic).mkdir(parents=True, exist_ok=True)
            for entry in definition["words"]:
                out = DEST / topic / f"{entry['slug']}.m4a"
                if out.exists() and not args.force:
                    skipped += 1
                    continue

                wav = pathlib.Path(tmp) / f"{entry['slug']}.wav"
                subprocess.run(
                    [sys.executable, "-m", "piper", "-m", str(VOICE), "-f", str(wav)],
                    input=entry["dutch"].encode(),
                    check=True,
                    capture_output=True,
                )
                subprocess.run(
                    ["afconvert", "-f", "m4af", "-d", "aac", "-b", "48000", str(wav), str(out)],
                    check=True,
                    capture_output=True,
                )
                made += 1
                print(f"{out.relative_to(REPO)}  {out.stat().st_size // 1024}KB  {entry['dutch']!r}")

    print(f"\n{made} generated, {skipped} already present")
    return 0


if __name__ == "__main__":
    sys.exit(main())
