#!/usr/bin/env python3
"""Validate profile SVG assets and refresh the activity signal metadata."""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ASSETS = [
    ROOT / "assets" / "multiverse-hero.svg",
    ROOT / "assets" / "project-map.svg",
    ROOT / "assets" / "worlds" / "carepulse-core.svg",
    ROOT / "assets" / "worlds" / "supporting-worlds.svg",
    ROOT / "assets" / "activity" / "contribution-fx.svg",
]

def validate_svg(path: Path) -> None:
    if not path.exists():
        raise SystemExit(f"Missing profile asset: {path.relative_to(ROOT)}")
    root = ET.parse(path).getroot()
    if not root.tag.endswith("svg"):
        raise SystemExit(f"Invalid SVG root: {path.relative_to(ROOT)}")
    text = path.read_text(encoding="utf-8")
    forbidden = ("<script", "<foreignObject", "javascript:")
    if any(token.lower() in text.lower() for token in forbidden):
        raise SystemExit(f"Unsupported GitHub README content in {path.relative_to(ROOT)}")

def refresh_activity_timestamp(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    marker = f"<!-- profile-visuals-refreshed:{stamp} -->"
    text = re.sub(r"\n?<!-- profile-visuals-refreshed:[^>]+ -->", "", text).rstrip()
    path.write_text(text + "\n" + marker + "\n", encoding="utf-8")

def main() -> None:
    for asset in ASSETS:
        validate_svg(asset)
    refresh_activity_timestamp(ASSETS[-1])
    print("Profile Multiverse assets validated and activity metadata refreshed.")

if __name__ == "__main__":
    main()
