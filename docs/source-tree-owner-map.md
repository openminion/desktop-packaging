# Source Tree Owner Map

| Path | Responsibility |
| --- | --- |
| `.github/workflows/ci.yml` | Read-only pull-request and branch quality gate |
| `packaging/inputs.json` | Exact Desktop, toolchain, and target identities |
| `packaging/dmg-background.svg` | Editable source for the dark installer background |
| `packaging/dmg-background.png` | Pinned background consumed by the native build |
| `packaging/dmg-dark-background.patch` | Packaging-only dark DMG presentation overlay |
| `packaging/build.mjs` | Source verification, disposable build, artifact staging, and verification |
| `tests/` | Packaging contract regression tests |
| `.github/workflows/prototype.yml` | Native prototype matrix and artifact upload |
| `docs/` | Packaging operation and proof boundaries |
| `dist/` | Ignored generated artifacts |

The repository must not gain Desktop application source, renderer code, a
Forge configuration, an OpenMinion runtime, or a second updater implementation.
