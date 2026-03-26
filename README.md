# My Favorite Places app

This is a demo app to work arround tests and CI, you should clone this repo, remove the `.git` folder and push it to your own public repo!

The client folder is empty, you may create an interface to communicate with the server! This is kind of a bonus

## Semantic versioning

This repository now uses `semantic-release` to generate clear versions automatically.

- Every push on `main` can create a release if commit messages follow the Conventional Commits format.
- Tags are generated as `vX.Y.Z`.
- Docker images are pushed with semantic tags (for example `1.4.0`, `1.4`, `v1.4.0`) plus `latest` on `main`.

### Commit message examples

- `feat(api): add nearest places endpoint` -> minor release
- `fix(auth): handle expired token` -> patch release
- `feat!: remove legacy login flow` or `BREAKING CHANGE:` in body -> major release

### Use a specific image version in production

In production compose, you can select the exact API image version:

```bash
APP_VERSION=1.4.0 docker compose -f server/src/compose.prod.yml up -d
```

Without `APP_VERSION`, compose uses `latest`.
