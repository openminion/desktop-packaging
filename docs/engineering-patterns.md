# Engineering Patterns

1. Consume one exact clean Desktop commit.
2. Verify release-relevant source files before executing them.
3. Apply release-presentation changes only as explicit packaging-owned overlays
   in the disposable clone.
4. Run Desktop's existing build and validation commands in that clone.
5. Keep local and hosted assembly behind `packaging/build.mjs`.
6. Record artifact identity with portable JSON and SHA-256 files.
7. Build only on the native platform being claimed.
8. Keep signing, publication, updates, and added platforms out until approved.

Use direct subprocess argument arrays and ordinary files. Do not add a generic
packaging framework, plugin layer, registry, event bus, or duplicate application
build owner.
