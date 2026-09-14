# Source Tree Owner Map

| Path | Responsibility |
| --- | --- |
| `packaging/inputs.json` | Exact Desktop, toolchain, and target identities |
| `packaging/build.mjs` | Source verification, disposable build, artifact staging, and verification |
| `tests/` | Packaging contract regression tests |
| `.github/workflows/prototype.yml` | Manual native prototype orchestration |
| `docs/` | Packaging operation and proof boundaries |
| `dist/` | Ignored generated artifacts |

The repository must not gain Desktop application source, renderer code, a
Forge configuration, an OpenMinion runtime, or a second updater implementation.

