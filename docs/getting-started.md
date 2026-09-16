# Getting Started

## Requirements

- Git
- Node.js 24
- npm 11.12.1
- `actionlint` for the complete repository check
- a clean `openminion/desktop` checkout at the pinned commit
- a native host matching one target in `packaging/inputs.json`

Place the repositories beside each other, then run:

```bash
make check
node packaging/build.mjs check --source ../desktop
node packaging/build.mjs build --source ../desktop --target macos-arm64
```

The build reads the source repository, creates a disposable clone, and writes
verified artifacts under `dist/`. It does not install dependencies or create
build output in the source checkout.

GitHub uses a repository secret named `DESKTOP_SOURCE_TOKEN` to read the private
Desktop source repository. Prefer a fine-grained token limited to read-only
Desktop contents; the organization currently disables repository deploy keys.
