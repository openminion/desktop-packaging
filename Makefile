NODE ?= node

.PHONY: help syntax test workflow-check check

help:
	@printf '%s\n' \
		'Targets:' \
		'  make syntax         Check JavaScript syntax' \
		'  make test           Run repository tests' \
		'  make workflow-check Validate GitHub Actions syntax' \
		'  make check          Run every local repository gate'

syntax:
	$(NODE) --check packaging/build.mjs
	$(NODE) --check tests/build.test.mjs

test:
	$(NODE) --test tests/*.test.mjs

workflow-check:
	actionlint .github/workflows/prototype.yml

check: syntax test workflow-check
