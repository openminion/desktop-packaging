# Certification Readiness Matrix

| Capability | Current evidence | Status |
| --- | --- | --- |
| Public source visibility | Protected `main` and `dev`, read-only default Actions permissions, private vulnerability reporting, secret scanning with push protection, and the 2026-10-20 tracked-history audit are active. | Ready |
| Packaging repository isolation | Source-verification and disposable-clone tests | Ready |
| Exact Desktop input | Commit and release-file hashes in `inputs.json` | Ready |
| macOS ARM64 unsigned package | Post-conversion hosted run 39417001621 passed and verified metadata and checksums before upload. | Prototype passed |
| macOS x64 unsigned package | Post-conversion hosted run 39417001621 passed and verified metadata and checksums before upload. | Prototype passed |
| Windows x64 unsigned package | Post-conversion hosted run 39417001621 passed and verified metadata and checksums before upload. | Prototype passed |
| Linux x64 unsigned package | Post-conversion hosted run 39417001621 passed and verified metadata and checksums before upload. | Prototype passed |
| Packaged contents | All four native jobs found 39 reviewed runtime entries | Prototype passed |
| Artifact provenance | All seven downloaded packages matched JSON metadata and SHA-256 files | Prototype passed |
| Desktop dependency audit | Exact native installs report 40 findings | Open debt |
| Third-party redistribution evidence | Packaged dependency licenses and required notices have not been reviewed as one release artifact set | Pending |
| Apple signing and notarization | Not implemented | Blocked |
| Clean-machine installation and first launch | Not run from this repository | Blocked |
| Update, rollback, migration, and uninstall | Not implemented | Blocked |
| Current Desktop revision | Existing native evidence covers only the pinned historical baseline | Refresh required |
| Public release | Workflow is intentionally nonpublishing | Blocked |

Only evidence from the exact pinned revision and native target can advance a
row. A successful repository test does not substitute for a native application
or release-lifecycle test.
