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
6. release-key and publication authority.

Do not add a release event or signing secrets to the prototype workflow.

The public `openminion/desktop` repository owns current unsigned development
packages. This repository remains an isolated release-assembly prototype until
the activation evidence above is approved; public source visibility does not
change that ownership.

## Public repository conversion

Complete this checklist when the repository is made public:

1. require pull requests and the passing `CI / Repository check` status for
   `main` and `dev`, and block force pushes and branch deletion,
2. retain read-only workflow permissions and keep the prototype workflow
   limited to `main` pushes and manual dispatch,
3. confirm the workflow checks out public `openminion/desktop` without a source
   token and remove the obsolete `DESKTOP_SOURCE_TOKEN` repository secret,
4. confirm that no Apple credential, certificate, notarization secret,
   generated package, or restricted evidence is tracked in Git history,
5. leave GitHub Releases and production signing disabled,
6. run `make check`, then run the native prototype matrix once after conversion
   to verify public-runner access on every target, and
7. refresh the pinned Desktop revision before making any current packaging or
   release-readiness claim.

Public workflow logs and temporary Actions artifacts are expected. Temporary
prototype artifacts remain unsigned and unsupported.
