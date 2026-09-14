# OpenMinion Desktop Packaging

Status: private prototype

This repository turns an exact, clean OpenMinion Desktop revision into verified
native distribution artifacts. It owns release assembly only. It does not
contain, patch, or replace Desktop application source or Forge configuration.

No artifact produced here is currently a supported public download.

## Current prototype

The first target is unsigned `macos-arm64`. The build pins:

- Desktop commit `6ab6893580a2f5381e83d9c2fed5ddd5216a0631`
- Node.js 24 and npm 11.12.1
- Electron 43.1.1 and Electron Forge 7.11.2 from Desktop's lockfile
- the exact Desktop `package.json`, `package-lock.json`, and `forge.config.ts`

The packaging command validates those inputs, clones the Desktop checkout into
a disposable directory, runs Desktop's existing `ci-check` and `make` commands,
and stages the resulting DMG and ZIP with portable metadata and SHA-256 files.
The source checkout is never edited.

## Local use

Use Node.js 24 and npm 11.12.1, then place this repository beside a clean
`desktop` checkout:

```bash
node packaging/build.mjs check --source ../desktop
node packaging/build.mjs build --source ../desktop --target macos-arm64
```

Run the packaging repository checks with:

```bash
make check
```

Generated files are written under `dist/` and are not committed.

## Repository boundary

- `packaging/inputs.json` pins the accepted Desktop and toolchain inputs.
- `packaging/build.mjs` is the only local and CI assembly entry point.
- `.github/workflows/prototype.yml` runs the same entry point on a native host.
- `tests/` protects source isolation, identity, and artifact verification.
- `docs/` explains operation, ownership, and proof boundaries.

Desktop application behavior, source builds, Forge configuration, and unsigned
developer packaging remain owned by `openminion/desktop`. OpenMinion runtime
packaging remains owned by `openminion/openminion-packaging`. This repository
does not share build code with either owner.

## Documentation

- [Getting started](docs/getting-started.md)
- [Source tree owner map](docs/source-tree-owner-map.md)
- [Testing and validation](docs/testing-and-validation.md)
- [Certification readiness](docs/certification-readiness-matrix.md)
- [Release boundary](RELEASING.md)

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) and
[NOTICE](NOTICE).

