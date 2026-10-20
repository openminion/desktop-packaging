# Releasing

Status: publication disabled; public-source conversion prepared

The current workflow creates short-lived unsigned prototype artifacts only. It
does not create a GitHub release or publish a download.

Public release activation requires separately approved evidence for:

1. an actual Desktop version rather than `0.0.0`,
2. Apple signing and notarization,
3. clean-machine installation and first launch,
4. update, rollback, migration, and uninstall behavior,
5. supported operating-system floors and architectures,
6. a reviewed third-party license inventory plus every required notice and
   source-offer artifact for the packaged Electron, Node.js, and npm dependency
   set, and
7. release-key and publication authority.

Do not add a release event or signing secrets to the prototype workflow.

The public `openminion/desktop` repository owns current unsigned development
packages. This repository remains an isolated release-assembly prototype until
the activation evidence above is approved; public source visibility does not
change that ownership.

## Public repository conversion

Complete this checklist when the repository is made public:

The current GitHub Free organization cannot preconfigure branch protection
while this repository is private. After changing visibility, configure the
first checklist item before accepting any other repository change.

1. require pull requests and the passing `CI / Repository check` status for
   `main` and `dev`, and block force pushes and branch deletion,
2. enable GitHub private vulnerability reporting and verify the link in
   `SECURITY.md` from a non-maintainer session,
3. retain read-only workflow permissions and keep the prototype workflow
   limited to `main` pushes and manual dispatch,
4. confirm the workflow checks out public `openminion/desktop` without a source
   token and that no obsolete source credential is configured,
5. confirm that no Apple credential, certificate, notarization secret,
   generated package, or restricted evidence is tracked in Git history,
6. leave GitHub Releases and production signing disabled,
7. run `make check`, then run the native prototype matrix once after conversion
   to verify public-runner access on every target, and
8. refresh the pinned Desktop revision before making any current packaging or
   release-readiness claim.

Public workflow logs and temporary Actions artifacts are expected. Temporary
prototype artifacts remain unsigned and unsupported.
