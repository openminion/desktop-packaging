# Testing and Validation

## Repository gate

```bash
make check
```

## Input verification

```bash
node packaging/build.mjs check --source ../desktop
```

This proves the source commit is clean and matches the pinned release files. It
does not build or certify an application.

## Native prototype

```bash
node packaging/build.mjs build --source ../desktop --target macos-arm64
```

The command uses a disposable clone, applies the pinned dark-background overlay,
runs Desktop's complete `ci-check`, runs its existing unsigned `make`, and
verifies staged DMG and ZIP files. This is
native unsigned packaging evidence only. It is not signing, notarization,
installation, update, rollback, or provider-backed application evidence.

## Artifact verification

```bash
node packaging/build.mjs verify --artifact dist/<artifact>
```

Verification requires the artifact, adjacent JSON metadata, and adjacent
portable SHA-256 file to agree with the current input manifest.

## Current native evidence

The first local Apple Silicon run against Desktop
`6ab6893580a2f5381e83d9c2fed5ddd5216a0631` completed Desktop's `ci-check`
with 207 tests passed and 3 skipped, verified 39 packaged runtime entries, and
produced verified DMG and ZIP artifacts. The install also reported 39 existing
Desktop dependency findings. This repository records that debt but does not
change Desktop dependencies.
