#!/usr/bin/env python3
"""Pre-publish safety checks for Brain-State Circuit Resonance.

This script is intentionally dependency-light so Hermes/nightly automation can run it
before any public commit or GitHub Pages publish. It checks the project boundary:
local agent inbox data and credentials must not be tracked or staged, static local
resources should resolve, and the toy-model tests should still pass.
"""
from __future__ import annotations

import html.parser
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
IGNORE_DIRS = {'.git', '.pytest_cache', '__pycache__', 'node_modules', 'agent-inbox'}
TEXT_EXTS = {
    '.html', '.css', '.js', '.md', '.py', '.txt', '.json', '.toml', '.yml', '.yaml', '.csv'
}
SECRET_PATTERNS = [
    ('OpenAI-style key', re.compile(r'\bsk-[A-Za-z0-9][A-Za-z0-9_-]{20,}\b')),
    ('GitHub token', re.compile(r'\bgh[pousr]_[A-Za-z0-9_]{20,}\b')),
    ('Private key block', re.compile(r'-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----')),
    ('Credential assignment', re.compile(r'(?i)\b(api[_-]?key|token|secret|password)\b\s*[:=]\s*["\']?[A-Za-z0-9_./+=-]{16,}')),
]

class LinkParser(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[tuple[str, str]] = []
        self.ids: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = dict(attrs)
        if attrs_dict.get('id'):
            self.ids.add(attrs_dict['id'] or '')
        if tag == 'script' and attrs_dict.get('src'):
            self.refs.append(('script', attrs_dict['src'] or ''))
        if tag == 'link' and attrs_dict.get('href'):
            self.refs.append(('link', attrs_dict['href'] or ''))
        if tag == 'a' and attrs_dict.get('href'):
            self.refs.append(('a', attrs_dict['href'] or ''))
        if tag == 'img' and attrs_dict.get('src'):
            self.refs.append(('img', attrs_dict['src'] or ''))


def run(cmd: list[str], *, check: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True, check=check)


def fail(message: str) -> None:
    print(f'FAIL: {message}')
    raise SystemExit(1)


def warn(message: str) -> None:
    print(f'WARN: {message}')


def ok(message: str) -> None:
    print(f'OK: {message}')


def check_agent_inbox_privacy() -> None:
    tracked = run(['git', 'ls-files', 'agent-inbox']).stdout.strip().splitlines()
    if tracked:
        fail('agent-inbox files are tracked: ' + ', '.join(tracked))

    staged = run(['git', 'diff', '--cached', '--name-only', '--', 'agent-inbox']).stdout.strip().splitlines()
    if staged:
        fail('agent-inbox files are staged: ' + ', '.join(staged))

    required = ['agent-inbox/comments.jsonl', 'agent-inbox/comments.latest.json', 'agent-inbox/.processed-ids']
    ignored = run(['git', 'check-ignore', '-v', *required]).stdout.strip().splitlines()
    if len(ignored) < len(required):
        fail('not all expected agent-inbox artifacts are ignored by .gitignore')
    ok('agent-inbox artifacts are ignored and untracked')


def iter_text_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob('*'):
        if not path.is_file():
            continue
        if any(part in IGNORE_DIRS for part in path.relative_to(ROOT).parts):
            continue
        if path.stat().st_size > 2_000_000:
            continue
        if path.suffix.lower() in TEXT_EXTS or path.name in {'.gitignore'} or path.name.startswith('.env'):
            files.append(path)
    return files


def check_secrets() -> None:
    hits: list[str] = []
    for path in iter_text_files():
        try:
            text = path.read_text(encoding='utf-8', errors='ignore')
        except OSError:
            continue
        for label, pattern in SECRET_PATTERNS:
            if pattern.search(text):
                hits.append(f'{path.relative_to(ROOT)} ({label})')
    if hits:
        fail('possible secrets found: ' + '; '.join(hits[:20]))
    ok('secret scan passed for repo text-like files')


def normalize_local_ref(ref: str) -> tuple[str | None, str | None]:
    ref = ref.strip()
    if not ref or ref.startswith(('mailto:', 'tel:', 'javascript:')):
        return None, None
    parsed = urlparse(ref)
    if parsed.scheme in {'http', 'https'}:
        return None, None
    if parsed.scheme or parsed.netloc:
        return None, None
    path = unquote(parsed.path)
    if path.startswith('/'):
        return None, parsed.fragment or None
    return (path or None), parsed.fragment or None


def check_static_refs() -> None:
    missing: list[str] = []
    parsed_html: dict[Path, LinkParser] = {}
    for html_file in ['index.html', 'project-brief.html', 'journey.html', 'future-research.html']:
        path = ROOT / html_file
        parser = LinkParser()
        parser.feed(path.read_text(encoding='utf-8', errors='ignore'))
        parsed_html[path.resolve()] = parser

    for path, parser in parsed_html.items():
        for kind, ref in parser.refs:
            local, fragment = normalize_local_ref(ref)
            target = path if not local else (path.parent / local).resolve()
            try:
                target.relative_to(ROOT)
            except ValueError:
                missing.append(f'{path.name}: {kind} escapes repo -> {ref}')
                continue
            if local and not target.exists():
                missing.append(f'{path.name}: missing {kind} -> {ref}')
                continue
            if fragment and target.suffix == '.html':
                target_parser = parsed_html.get(target)
                if target_parser is None and target.exists():
                    target_parser = LinkParser()
                    target_parser.feed(target.read_text(encoding='utf-8', errors='ignore'))
                    parsed_html[target] = target_parser
                if target_parser is not None and fragment not in target_parser.ids:
                    missing.append(f'{path.name}: missing anchor -> {ref}')
    if missing:
        fail('missing static references: ' + '; '.join(missing))
    ok('static HTML local references and anchors resolve')


def check_tests() -> None:
    node = run(['node', 'test.js'])
    if node.returncode != 0:
        print(node.stdout)
        print(node.stderr, file=sys.stderr)
        fail('node test.js failed')
    ok('node simulation tests passed')

    py = run([sys.executable, '-m', 'unittest', 'discover', '-s', 'tests'])
    if py.returncode != 0:
        print(py.stdout)
        print(py.stderr, file=sys.stderr)
        fail('Python synthetic-data unit tests failed')
    ok('Python synthetic-data unit tests passed')


def main() -> int:
    os.chdir(ROOT)
    print(f'Pre-publish safety check: {ROOT}')
    check_agent_inbox_privacy()
    check_secrets()
    check_static_refs()
    check_tests()
    ok('all pre-publish safety checks passed')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
