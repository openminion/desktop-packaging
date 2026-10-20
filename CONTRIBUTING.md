# Contributing

Changes must stay within Desktop release assembly. Application behavior belongs
in `openminion/desktop`; standalone CLI packaging belongs in
`openminion/openminion-packaging`.

Before opening a pull request:

```bash
make check
```

Run `make release-check` when changing packaging, workflows, or public
repository guidance.

Use a focused commit such as `build(packaging): update desktop prototype input`
and include exact validation commands in the pull request description.

Open pull requests against `dev`; promote reviewed `dev` changes to `main`
through a separate release or repository-maintenance pull request.
