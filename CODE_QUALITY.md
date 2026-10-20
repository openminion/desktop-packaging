# Code Quality

Keep this repository small and release-focused.

- Do not copy Desktop application code or Forge configuration here.
- Keep one build entry point for local and hosted use.
- Use argument arrays for subprocesses; do not construct shell commands.
- Pin source, toolchain, workflow actions, and artifact identities.
- Add tests for changes to input or artifact contracts.
- Build every claimed target on its matching native GitHub runner.
- Run `make check` before pushing.
- Run `make release-check` for packaging, workflow, or public-guidance changes.
