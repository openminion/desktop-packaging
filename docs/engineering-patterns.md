# Engineering Patterns

1. Consume one exact clean Desktop commit.
2. Verify release-relevant source files before executing them.
3. Run Desktop's existing build and validation commands in a disposable clone.
4. Keep local and hosted assembly behind `packaging/build.mjs`.
5. Record artifact identity with portable JSON and SHA-256 files.
6. Build only on the native platform being claimed.
7. Keep signing, publication, updates, and added platforms out until approved.

Use direct subprocess argument arrays and ordinary files. Do not add a generic
packaging framework, plugin layer, registry, event bus, or duplicate application
build owner.

