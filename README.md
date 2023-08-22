# flood-webchat

## How to Publish

### A Pre-Release

Via the GitHub GUI, create a release off your branch with a name matching a semver version pattern for the appropriate
version with an added pre-release identifier, and check the pre-release identifier.
For example if the latest published version was `v1.2.3` and you wish to publish a pre-release from your "cool-update"
branch, name the release: `v1.2.4-cool-update.1`

### A Release

Via the GitHub GUI, create a release off the main branch with a name matching a semver version pattern with the
appropriate version bump. For example if the latest published version was `v1.2.3` and you wish to release:
- a patch update, the new release should be called `v1.2.4`
- a minor update, the new release should be called `v1.3.0`
- a major update, the new release should be called `v2.0.0`