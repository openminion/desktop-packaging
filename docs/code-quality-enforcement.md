# Code-Quality Enforcement

`make check` runs:

1. JavaScript syntax checks,
2. the Node test suite,
3. `actionlint` for the prototype workflow.

The tests enforce the repository documentation floor, exact input shape, clean
source identity, release-file hashes, native target identities, portable
checksums, and artifact mutation detection. GitHub Actions use commit-pinned
third-party actions and native runners for every claimed target.
