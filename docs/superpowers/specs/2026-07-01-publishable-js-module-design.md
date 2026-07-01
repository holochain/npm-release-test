# Publishable JS Module Design

## Purpose

`@holochain/npm-release-test` is a dummy package used to test the
`holochain/actions` Node.js release workflows. Right now it ships only
`README.md`, so consecutive releases carry no real code diff. This design
adds a small, publishable JavaScript module so each release produces a
meaningful diff to publish.

## Scope

- Add `src/index.js` with two pure functions.
- Wire `package.json` so the module ships in the npm tarball.
- Keep the existing `build`/`test` echo stubs (dummy repo, no toolchain).

Out of scope: bundlers, a `dist` build step, TypeScript, CI test wiring.

## Module

File: `src/index.js`

- `version()` returns the current `package.json` version string. Bumping
  the version each release changes this output automatically.
- `greet(name)` returns `Hello, <name>!`. Missing or empty `name` coerces
  to `world`. This message is the intentional knob to tweak between
  releases when a code-only diff is wanted.

No dependencies, no I/O beyond reading the package version.

## package.json changes

- Add `"main": "src/index.js"`.
- Change `files` from `["README.md"]` to `["README.md", "src"]` so the
  module lands in the published tarball.
- Leave `build`, `test`, `prepublishOnly`, and `publish` scripts as-is.

## Error handling

`greet` is the only branch: falsy `name` becomes `world`. Everything else
is a straight return. No throwing.

## Testing

The repo ships no test suite by design; the `test` script stays an echo
stub. A real test can be added later if desired, but it is not part of
this change.

## Per-release diff strategy

Each publish bumps the `version` string and, when a pure code diff is
wanted, tweaks the `greet` message. Together these guarantee a
non-trivial diff on every release.

## Conventions

`src/index.js` is JavaScript, so the `js-conventions` skill governs its
implementation.
