# @holochain/npm-release-test

Dummy npm package used to test the Node.js release workflows in
[holochain/actions](https://github.com/holochain/actions).

It exists to reproduce and prove a fix for issue
[#19](https://github.com/holochain/actions/issues/19): the publish workflow
randomly failing to detect the `hra-release` label on a freshly merged pull
request, caused by the eventual consistency of the GitHub
`commits/{sha}/pulls` API.

The package ships no real code. `build` is a no-op and nothing is imported by
consumers.

## Workflows under test

- `.github/workflows/prepare-release.yml` runs on demand
  (`workflow_dispatch`). It calls the reusable `nodejs-prepare-release`
  workflow, which bumps the version, generates the changelog, and opens a
  release pull request labelled `hra-release`.
- `.github/workflows/publish-release.yml` runs on every push to `main`. It
  calls the reusable `nodejs-publish-release` workflow, which checks the merged
  pull request for the `hra-release` label and, if present, publishes to npm.

Both callers currently point at the fix branch
`ci/19-npm-publish-randomly-ignores-the-release-label`. Switch them to
`@stable` once the fix is released.

## One-time setup

1. Create the repository at
   <https://github.com/holochain/npm-release-test> and push this directory to
   `main`.
2. Add the repository secrets:
   - `HRA_GH_TOKEN`: a token allowed to open pull requests and request
     reviewers.
   - `NPM_TOKEN`: an npm automation token with publish rights on the
     `@holochain` scope (omit if using npm Trusted Publishers).
3. Publish the initial version manually so later runs have a version to bump
   from:

   ```bash
   npm publish --access public
   ```

   Provenance is skipped here on purpose; it only works from CI. Tag the same
   commit so auto-detection has a baseline:

   ```bash
   git tag v0.0.0 && git push origin v0.0.0
   ```

## Reproducing the bug and proving the fix

1. Run the **Prepare Release** workflow (optionally with a `force_version`).
2. Approve and merge the release pull request it opens.
3. Watch **Publish Release** trigger on the merge commit. The `check` job
   should detect the `hra-release` label without a rerun and publish the new
   version.

Repeat the cycle several times. Before the fix, the `check` job intermittently
missed the label and needed a manual rerun. After the fix, it retries only
while the associated pull request list is still empty, so the label is detected
on the first attempt every time.
