# Certification Readiness Matrix

| Capability | Current evidence | Status |
| --- | --- | --- |
| Packaging repository isolation | Source-verification and disposable-clone tests | Ready |
| Exact Desktop input | Commit and release-file hashes in `inputs.json` | Ready |
| macOS ARM64 unsigned package | Hosted run 35056130078 passed; downloaded DMG and ZIP reverified | Prototype passed |
| macOS x64 unsigned package | Hosted run 35056130078 passed; downloaded DMG and ZIP reverified | Prototype passed |
| Windows x64 unsigned package | Hosted run 35056130078 passed; downloaded ZIP reverified | Prototype passed |
| Linux x64 unsigned package | Hosted run 35056130078 passed; downloaded DEB and ZIP reverified | Prototype passed |
| Packaged contents | All four native jobs found 39 reviewed runtime entries | Prototype passed |
| Artifact provenance | All seven downloaded packages matched JSON metadata and SHA-256 files | Prototype passed |
| Desktop dependency audit | Exact native installs report 40 findings | Open debt |
| Apple signing and notarization | Not implemented | Blocked |
| Clean-machine installation and first launch | Not run from this repository | Blocked |
| Update, rollback, migration, and uninstall | Not implemented | Blocked |
| Public release | Workflow is intentionally nonpublishing | Blocked |

Only evidence from the exact pinned revision and native target can advance a
row. A successful repository test does not substitute for a native application
or release-lifecycle test.
