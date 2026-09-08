# Releasing

Publishing uses **npm Trusted Publisher (OIDC)**. There is no `NPM_TOKEN`.

```bash
git checkout main && git pull
git tag v1.2.0
git push origin v1.2.0
```

`.github/workflows/release.yml` then:

1. installs, tests, builds
2. `npm pack --dry-run`
3. `npm publish --access public` over OIDC (provenance is automatic)
4. opens a GitHub Release from the latest `CHANGELOG.md` section

The tag must be `v` + `package.json` version.

## One-time: register the trusted publisher

On [npmjs.com/package/react-native-device-spec-info](https://www.npmjs.com/package/react-native-device-spec-info) → **Settings** → **Trusted Publisher**:

| Field | Value |
|---|---|
| Provider | GitHub Actions |
| Organization or user | `Naandalist` |
| Repository | `react-native-device-spec-info` |
| Workflow filename | `release.yml` |
| Environment | leave empty |

Existing trusted-publisher rows cannot be edited; delete and recreate if a field is wrong.

Requires npm CLI ≥ 11.5.1 (the workflow installs `npm@latest`) and a GitHub-hosted runner.

## Dry run

Actions → **release** → Run workflow → leave **dry_run** checked.

## First 1.2.0 cut

`main` is already `1.2.0`. After this workflow is on `main` and the trusted publisher exists:

```bash
git tag v1.2.0
git push origin v1.2.0
```
