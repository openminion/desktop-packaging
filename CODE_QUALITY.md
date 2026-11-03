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

## Comment and docstring review

This rule applies to every contributor and coding agent, including tests and
scripts. Let clear names, types and direct control flow explain ordinary steps.
Review every added or changed comment and docstring in the final diff; remove
obvious restatements, decorative banners and duplicated walkthroughs. Keep one
concise explanation at the owner when a constraint is not obvious.

Preserve public API and model-facing descriptions, required notices/directives,
and useful safety, compatibility and regression-oracle rationale. Keep short
factual module explainers; move longer design/history narratives to docs.
Passing automated checks does not replace this review, and there is no comment
quota. Check current source and existing reports before filing cleanup debt;
keep unrelated cleanup out of a feature PR.
