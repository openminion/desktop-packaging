# Changelog

## Unreleased

- Keep Windows subprocess arguments structured and align public guidance with
  the current CI, prototype, and nonpublishing package boundaries.
- Route the prototype target through a quoted environment value before the
  shell boundary while retaining the exact pinned npm toolchain bootstrap.
- Add direct security/support links, make hosted verification pending in the
  public-readiness status, and record third-party redistribution evidence as a
  release-activation gate.
- Keep the historical four-platform prototype matrix manual-only until its
  pinned Desktop input is current.
- Prepare the repository for public source visibility while keeping release
  publication disabled.
- Remove the obsolete credential used to clone the now-public Desktop source.
- Clarify that the pinned matrix is historical prototype evidence and that
  current unsigned Desktop development packages remain owned by `desktop`.
- Add a read-only pull-request and branch quality workflow for the required
  repository check.
- Add native macOS x64, Windows x64, and Linux x64 prototype artifacts alongside
  macOS arm64, with hosted checks and 14-day GitHub artifact retention.
- Use a dark background for the macOS drag-to-Applications window.
- Add the isolated Desktop packaging prototype.
- Pin one exact Desktop revision and native target matrix.
- Add portable artifact metadata and checksum verification.
- Add a nonpublishing native workflow.
