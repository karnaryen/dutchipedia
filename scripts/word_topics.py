"""Reads scripts/word-topics.json for the three generators beside it.

A key in that file is either a topic — it has `words` — or a section, which
has `groups` of topics instead and gets a page of its own listing them:

    "cats": { "title": …, "words": [ … ] }
    "body": { "title": …, "groups": [ { "title": …, "topics": { "senses": { … "words": [ … ] } } } ] }

Everything a topic owns sits under its path, which for a topic inside a
section includes the section: content/words/body/senses/, and the same under
public/audio/words/. That path is also how the command line names it.
"""

from __future__ import annotations

import json
import pathlib

REPO = pathlib.Path(__file__).resolve().parent.parent
# The words live in the woordenschat zone, not at the repo root.
ROOT = REPO / "apps" / "woordenschat"
CONTENT = ROOT / "content" / "words"
AUDIO = ROOT / "public" / "audio" / "words"

DEFINITIONS: dict = json.loads((pathlib.Path(__file__).resolve().parent / "word-topics.json").read_text())


def is_section(definition: dict) -> bool:
    return "groups" in definition


def section_topics(definition: dict) -> dict[str, dict]:
    """The topics of a section by slug, in page order."""
    return {slug: topic for group in definition["groups"] for slug, topic in group["topics"].items()}


def topics() -> dict[str, dict]:
    """Every topic that holds words, by path: "cats", "body/senses"."""
    found = {}
    for slug, definition in DEFINITIONS.items():
        if is_section(definition):
            for child, topic in section_topics(definition).items():
                found[f"{slug}/{child}"] = topic
        else:
            found[slug] = definition
    return found


def select(names: list[str]) -> dict[str, dict]:
    """The topics named on a command line. A section's name selects all of its
    topics, so `body` and `body/senses` both work."""
    every = topics()
    chosen = {}
    for name in names:
        matches = {path: topic for path, topic in every.items() if path == name or path.startswith(name + "/")}
        if not matches:
            raise SystemExit(f"no topic {name!r} in word-topics.json — known: {', '.join(every)}")
        chosen.update(matches)
    return chosen
