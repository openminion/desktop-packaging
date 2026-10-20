# Testing and Validation

## Repository gate

```bash
make check
```

The read-only `CI` workflow runs this same gate for pull requests and pushes to
`dev` and `main`. Its `Repository check` job is the required protected-branch
status check. The separate native prototype matrix remains a
manual, `main`-only proof surface while its pinned Desktop input is historical.

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

## Validated baseline evidence

[Post-conversion run 39417001621](https://github.com/openminion/desktop-packaging/actions/runs/39417001621)
passed on all four native targets after the Windows matrix-target fix. Each job
verified its artifact metadata and SHA-256 sidecars before uploading the
temporary bundle.

[GitHub run 35056130078](https://github.com/openminion/desktop-packaging/actions/runs/35056130078)
also passed on all four native targets against the historical Desktop baseline
`1867ca2d3703c29f3d8c8808b71f39b8c42215c0`. Each job completed Desktop's
`ci-check`, verified 39 packaged runtime entries, built the target's expected
formats, and uploaded the resulting bundle. The seven downloaded packages were
then reverified locally against their adjacent JSON metadata and SHA-256 files:

- macOS arm64: DMG and ZIP
- macOS x64: DMG and ZIP
- Windows x64: ZIP
- Linux x64: DEB and ZIP

Each native install reported 40 existing Desktop dependency findings. This
repository records that debt but does not change Desktop dependencies.

This evidence does not describe the current Desktop revision or its current
unsigned development releases. Refresh the pinned input and rerun the complete
native matrix before making any new release-readiness claim.
