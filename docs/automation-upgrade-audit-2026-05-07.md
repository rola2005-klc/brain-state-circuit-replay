# Automation Upgrade Audit — 2026-05-07

This note records the first default Codex + Claude review cycle for Brain-State Circuit Resonance.

## Agent roles used

- Hermes: orchestration, safety boundary, local changes, final verification.
- Codex CLI: technical/static-site/automation audit under local ChatGPT auth.
- Claude Code: conceptual, UX, scientific-boundary, and logical-loophole audit.

## Codex technical findings

Safe current state:

- Git status was clean before local safety-check additions.
- `agent-inbox/comments.jsonl`, `agent-inbox/comments.latest.json`, and `agent-inbox/.processed-ids` are ignored and untracked.
- Existing JavaScript and Python toy-model tests passed during audit.

Important risks:

- GitHub Pages/public site depends on CDN-hosted `three` and `3d-force-graph`; CDN outage or unpinned serving behavior can break the primary 3D experience.
- Comment Mode intentionally posts to `/api/comment-inbox`, which fails on GitHub Pages and falls back to local browser storage. This should stay documented so it is not mistaken for a broken public feature.
- Local inbox server uses permissive CORS while bound to `127.0.0.1`; low external exposure, but any local browser page could post while the local server is running.
- The canvas/3D graph needs a non-3D accessible path and reduced-motion/low-power behavior before it becomes professor/portfolio robust.
- The repo lacked an in-repo prepublish safety gate before this upgrade.

## Claude conceptual/scientific findings

Overall posture: responsible. The repo generally preserves “Resonance over Replay” and does not claim medical benefit, literal time travel, EEG engram reading, real brain-derived output, or exact visual memory playback.

Weak bridges to tighten:

- “Plasticity as native biological record” is useful, but trace existence is not trace addressability. Retroactive addressability remains the hard problem.
- “Integrated self-state” is a conceptual synthesis, not an established measurable neuroscience metric; UI similarity/error numbers can imply more precision than exists.
- “Configured ignorance” is strong as phenomenological framing, but a system cannot literally know what the past self did not know. Treat it as a design/narrative principle unless the user chooses otherwise.
- Reconsolidation can update or distort memory, not only restore access; it should be framed as a safety variable.
- Professor-facing hard question: what distinguishes Resonance from cue-triggered recall? The answer should be surfaced as one crisp paragraph.

## Safe local upgrade applied now

Added:

```bash
scripts/safety_check.py
```

It checks:

- local `agent-inbox/` artifacts are ignored and untracked;
- staged inbox files fail the gate;
- repo text-like files do not contain common credential patterns;
- local references and anchors in `index.html`, `project-brief.html`, `journey.html`, and `future-research.html` resolve;
- `node test.js` passes;
- `python3 -m unittest discover -s tests` passes.

README now documents this pre-publish safety gate.

## Recommended next automatic upgrades

These are technical/project-management changes Hermes can do without changing the creative thesis:

1. Safety check has now been wired into the nightly auto-publish job prompt before commit/push.
2. Add a small static smoke test that starts a local server and checks key pages return 200.
3. Add a public-site comment-mode note: GitHub Pages comments save locally; Hermes inbox only works on local server.
4. Add a reduced-motion CSS/JS guard for animations.
5. Add a text-only accessible concept-outline fallback generated from `src/graph-data.js`.

## Decisions requiring user creative judgment

Ask the user before doing these:

1. Whether “configured ignorance” is a philosophical framing layer or an operational design target.
2. Whether retroactive addressability should be framed as an explicit unsolved blocker or a bracketed future assumption.
3. Whether to keep the MIMO/direct-engram pathway in the main UI or move it to a visually separated speculative frontier.
4. Whether the main site should prioritize professor-facing caution or portfolio-facing emotional impact.
5. Whether to keep the 90.83% synthetic accuracy number in the main README or move it to a technical appendix.
6. Whether to vendor Three.js / 3d-force-graph locally or keep CDN dependencies.

## Verification run

Command:

```bash
python3 scripts/safety_check.py
```

Result: passed.
