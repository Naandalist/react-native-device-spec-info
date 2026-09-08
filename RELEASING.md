# Releasing

Pushing a version tag publishes to npm and opens a GitHub Release.

```bash
# 1. package.json version and CHANGELOG already match, e.g. 1.2.0
git checkout main && git pull

# 2. Tag the current commit
git tag v1.2.0
git push origin v1.2.0
```

That triggers `.github/workflows/release.yml`:

1. `npm test`
2. `npm run build`
3. `npm pack --dry-run`
4. `npm publish --access public --provenance`
5. `gh release create` from the latest `CHANGELOG.md` section

The tag **must** be `v` + `package.json` version (`v1.2.0`). A mismatch fails the job.

## One-time setup

Pick one (trusted publisher is preferred):

### A. npm Trusted Publisher (OIDC, no long-lived token)

1. npmjs.com → `react-native-device-spec-info` → **Trusted Publisher**
2. Provider: GitHub Actions
3. Organization or user: `Naandalist`
4. Repository: `react-native-device-spec-info`
5. Workflow filename: `release.yml`

### B. Classic token

1. npmjs.com → Access Tokens → Granular Access Token
   - Permission: **Read and write** on this package
2. GitHub repo → Settings → Secrets and variables → Actions
3. New repository secret name: `NPM_TOKEN`
4. Value: the npm token

The workflow sends `NODE_AUTH_TOKEN` from `secrets.NPM_TOKEN` and also requests `id-token: write` for provenance / trusted publishing.

## Dry run

Actions → **release** → Run workflow → leave **dry_run** checked.

That installs, tests, builds, and packs. It does not publish.

## First 1.2.0 cut

`main` is already `1.2.0`. After this workflow is merged and the secret / trusted publisher is set:

```bash
git tag v1.2.0
git push origin v1.2.0
```
