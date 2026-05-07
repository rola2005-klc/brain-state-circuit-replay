#!/usr/bin/env python3
"""Print unprocessed local Comment Mode inbox records as JSON.

Used by Hermes/Codex automation. It never uploads data. It reads
agent-inbox/comments.jsonl and tracks processed comment ids in
agent-inbox/.processed-ids.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
INBOX = ROOT / "agent-inbox" / "comments.jsonl"
PROCESSED = ROOT / "agent-inbox" / ".processed-ids"


def load_processed() -> set[str]:
    if not PROCESSED.exists():
        return set()
    return {line.strip() for line in PROCESSED.read_text(encoding="utf-8").splitlines() if line.strip()}


def read_records() -> list[dict[str, Any]]:
    if not INBOX.exists():
        return []
    records = []
    for line in INBOX.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(record, dict):
            records.append(record)
    return records


def comment_id(record: dict[str, Any]) -> str:
    comment = record.get("comment") if isinstance(record.get("comment"), dict) else {}
    return str(comment.get("id") or record.get("receivedAt") or "")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mark", action="store_true", help="mark printed comments as processed")
    args = parser.parse_args()

    processed = load_processed()
    records = [r for r in read_records() if comment_id(r) and comment_id(r) not in processed]
    print(json.dumps({"count": len(records), "records": records}, ensure_ascii=False, indent=2))

    if args.mark and records:
        PROCESSED.parent.mkdir(parents=True, exist_ok=True)
        with PROCESSED.open("a", encoding="utf-8") as fh:
            for record in records:
                fh.write(comment_id(record) + "\n")


if __name__ == "__main__":
    main()
