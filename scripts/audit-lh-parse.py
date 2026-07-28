#!/usr/bin/env python3
import json
from pathlib import Path

for name in ["lh-home-after.json", "lh-services-after.json"]:
    p = Path("/tmp/corevia-audit") / name
    d = json.loads(p.read_text())
    print("===", name)
    for k, a in d.get("audits", {}).items():
        score = a.get("score")
        if score is None or score >= 0.9:
            continue
        if a.get("scoreDisplayMode") not in ("binary", "numeric", "metricSavings"):
            continue
        title = a.get("title")
        display = a.get("displayValue") or ""
        print(f"  {k}: {score} | {title} | {display}")
