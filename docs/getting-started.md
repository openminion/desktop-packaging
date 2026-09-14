# Getting Started

## Requirements

- macOS 14 or later on Apple Silicon
- Git
- Node.js 24
- npm 11.12.1
- `actionlint` for the complete repository check
- a clean `openminion/desktop` checkout at the pinned commit

Place the repositories beside each other, then run:

```bash
make check
node packaging/build.mjs check --source ../desktop
node packaging/build.mjs build --source ../desktop --target macos-arm64
```

The build reads the source repository, creates a disposable clone, and writes
verified artifacts under `dist/`. It does not install dependencies or create
build output in the source checkout.

The manual GitHub workflow requires a repository secret named
`DESKTOP_SOURCE_TOKEN` with read access to the private Desktop repository.

