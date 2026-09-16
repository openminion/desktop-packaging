# Certification Readiness Matrix

| Capability | Current evidence | Status |
| --- | --- | --- |
| Packaging repository isolation | Source-verification and disposable-clone tests | Ready |
| Exact Desktop input | Commit and release-file hashes in `inputs.json` | Ready |
| macOS ARM64 unsigned package | Prior local native run passed; refreshed hosted run pending | Pending refresh |
| macOS x64 unsigned package | Native hosted job configured | Pending first run |
| Windows x64 unsigned package | Native hosted job configured | Pending first run |
| Linux x64 unsigned package | Native hosted job configured | Pending first run |
| Packaged contents | Desktop package check found 39 reviewed runtime entries | Prototype passed |
| Artifact provenance | DMG and ZIP JSON metadata and SHA-256 verification passed | Prototype passed |
| Desktop dependency audit | Existing Desktop lock reports 39 findings during install | Open debt |
| Apple signing and notarization | Not implemented | Blocked |
| Clean-machine installation and first launch | Not run from this repository | Blocked |
| Update, rollback, migration, and uninstall | Not implemented | Blocked |
| Public release | Workflow is intentionally nonpublishing | Blocked |

Only evidence from the exact pinned revision and native target can advance a
row. A successful repository test does not substitute for a native application
or release-lifecycle test.
