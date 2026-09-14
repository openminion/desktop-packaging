# Certification Readiness Matrix

| Capability | Current evidence | Status |
| --- | --- | --- |
| Packaging repository isolation | Source-verification and disposable-clone tests | Ready |
| Exact Desktop input | Commit and release-file hashes in `inputs.json` | Ready |
| macOS ARM64 unsigned package | Local native run at Desktop `6ab6893580a2`: 207 tests passed, 3 skipped; DMG and ZIP produced | Prototype passed |
| Packaged contents | Desktop package check found 39 reviewed runtime entries | Prototype passed |
| Artifact provenance | DMG and ZIP JSON metadata and SHA-256 verification passed | Prototype passed |
| Desktop dependency audit | Existing Desktop lock reports 39 findings during install | Open debt |
| Apple signing and notarization | Not implemented | Blocked |
| Clean-machine installation and first launch | Not run from this repository | Blocked |
| Update, rollback, migration, and uninstall | Not implemented | Blocked |
| Windows and Linux packages | Not configured by Desktop | Blocked |
| Public release | Workflow is intentionally nonpublishing | Blocked |

Only evidence from the exact pinned revision and native target can advance a
row. A successful repository test does not substitute for a native application
or release-lifecycle test.
