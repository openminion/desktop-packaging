# API Compatibility

This repository has no runtime API. Its supported operator contract is the
three commands exposed by `packaging/build.mjs`: `check`, `build`, and
`verify`.

The accepted input is the exact Desktop revision and file hashes recorded in
`packaging/inputs.json`. Updating that manifest is an explicit packaging change
and does not change Desktop itself.

Artifact metadata uses `schema_version: 1`. A future schema change must retain
or deliberately migrate verification of already-produced artifacts.

