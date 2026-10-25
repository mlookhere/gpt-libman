# GPT Library Manager — source bootstrap in progress

Repository: `mlookhere/gpt-libman`. Production: `main`. Integration: `dev`.

[Issue #1](https://github.com/mlookhere/gpt-libman/issues/1) tracks import of v3.0.14 and migration to the `CI-Pipline` contract.

**State:** This work branch does not yet contain the full extension source. Do not merge or release it. Import the complete v3.0.14 source ZIP, including `src/`, `public/`, tests, `package-lock.json`, `.github/`, `.chatfreept/`, and `ci/`. Exclude `dist/` and dependencies from Git. The ZIP contains `scripts/publish-bootstrap.ps1` to stage, commit and push into `work/1-bootstrap-v3` from a GitHub-authenticated Windows machine.

After import, review a PR into `dev` and require actual green CI checks for TypeScript, Webpack, Node tests, Chromium tests, dependency audit, PR metadata, and workflow policy. Promote `dev` to `main` with a separately gated release PR. This branch's policy files alone are not evidence of CI success.
