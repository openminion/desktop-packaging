# Releasing

Status: disabled

The current workflow creates short-lived unsigned prototype artifacts only. It
does not create a GitHub release or publish a download.

Public release activation requires separately approved evidence for:

1. an actual Desktop version rather than `0.0.0`,
2. Apple signing and notarization,
3. clean-machine installation and first launch,
4. update, rollback, migration, and uninstall behavior,
5. supported operating-system floors and architectures,
6. release-key and publication authority.

Do not add a release event or signing secrets to the prototype workflow.
