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

## Native prototypes

```bash
node packaging/build.mjs build --source ../desktop --target macos-arm64
```

Use `macos-x64`, `windows-x64`, or `linux-x64` only on the corresponding native
host. The build rejects a target that does not match the host platform and
architecture.

The command uses a disposable clone, applies the pinned dark-background overlay
to macOS builds, runs Desktop's complete `ci-check`, runs its existing unsigned
`make`, and verifies the expected artifacts for that target. This is native
unsigned packaging evidence only. It is not signing, notarization, installation,
update, rollback, or provider-backed application evidence.

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
change Desktop dependencies. Hosted evidence for the expanded target matrix is
pending the first successful workflow run.
