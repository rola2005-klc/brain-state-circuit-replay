#!/usr/bin/env python3
"""Local static server + agent inbox endpoint for Brain-State Circuit Resonance.

This is intentionally local-only. It serves the static website and accepts Comment
Mode POSTs at /api/comment-inbox, appending them to agent-inbox/comments.jsonl.
Do not deploy this endpoint to GitHub Pages/public hosting.
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
INBOX_DIR = ROOT / "agent-inbox"
JSONL_PATH = INBOX_DIR / "comments.jsonl"
LATEST_PATH = INBOX_DIR / "comments.latest.json"
MAX_BODY_BYTES = 128 * 1024


class AgentInboxHandler(SimpleHTTPRequestHandler):
    server_version = "BrainResonanceAgentInbox/1.0"

    def end_headers(self) -> None:
        # Safe for local same-origin use; also lets a localhost page retry if a
        # browser normalizes 127.0.0.1/localhost differently.
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self) -> None:  # noqa: N802 - http.server API
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802 - http.server API
        if self.path == "/api/comment-inbox/health":
            self._send_json({"ok": True, "inbox": str(JSONL_PATH), "serverTime": now_iso()})
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802 - http.server API
        if self.path.split("?", 1)[0] != "/api/comment-inbox":
            self.send_error(HTTPStatus.NOT_FOUND, "Unknown endpoint")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.send_error(HTTPStatus.LENGTH_REQUIRED, "Invalid Content-Length")
            return

        if length <= 0:
            self.send_error(HTTPStatus.BAD_REQUEST, "Empty request body")
            return
        if length > MAX_BODY_BYTES:
            self.send_error(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, "Comment payload too large")
            return

        raw = self.rfile.read(length)
        try:
            payload = json.loads(raw.decode("utf-8"))
        except Exception:
            self.send_error(HTTPStatus.BAD_REQUEST, "Invalid JSON")
            return

        record = sanitize_record(payload)
        INBOX_DIR.mkdir(parents=True, exist_ok=True)
        with JSONL_PATH.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(record, ensure_ascii=False, sort_keys=True) + "\n")
        LATEST_PATH.write_text(json.dumps(record, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        self._send_json({"ok": True, "path": str(JSONL_PATH), "receivedAt": record["receivedAt"]})

    def _send_json(self, payload: dict[str, Any], status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def clean_text(value: Any, max_len: int = 4000) -> str:
    return str(value or "").replace("\x00", "").strip()[:max_len]


def sanitize_target(target: Any) -> dict[str, str]:
    if not isinstance(target, dict):
        target = {}
    return {
        "kind": clean_text(target.get("kind"), 80),
        "id": clean_text(target.get("id"), 240),
        "label": clean_text(target.get("label"), 240),
        "url": clean_text(target.get("url"), 500),
    }


def sanitize_record(payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValueError("payload must be a JSON object")
    comment = payload.get("comment") if isinstance(payload.get("comment"), dict) else payload
    return {
        "schema": "brain-replay-agent-inbox/comment-v1",
        "receivedAt": now_iso(),
        "source": clean_text(payload.get("source"), 500),
        "pageTitle": clean_text(payload.get("pageTitle"), 200),
        "comment": {
            "id": clean_text(comment.get("id"), 120),
            "version": int(comment.get("version") or 1),
            "type": clean_text(comment.get("type"), 40) or "note",
            "body": clean_text(comment.get("body"), 4000),
            "resolved": bool(comment.get("resolved")),
            "target": sanitize_target(comment.get("target")),
            "createdAt": clean_text(comment.get("createdAt"), 80),
            "updatedAt": clean_text(comment.get("updatedAt"), 80),
        },
        "agentHandoff": {
            "repo": "brain-state-circuit-replay",
            "instruction": "Review this website comment and implement a safe local fix when appropriate. Do not push externally without user confirmation.",
        },
    }


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    import os

    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", port), AgentInboxHandler)
    print(f"Serving {ROOT} at http://127.0.0.1:{port}/")
    print(f"Agent inbox POST endpoint: http://127.0.0.1:{port}/api/comment-inbox")
    print(f"Inbox file: {JSONL_PATH}")
    server.serve_forever()


if __name__ == "__main__":
    main()
