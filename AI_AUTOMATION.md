# AI Automation Support

This document describes the AI automation features added to quick-publish.

## New CLI Options

### `--dry-run`
Shows what commands would be executed without actually running them. Perfect for AI agents to understand what will happen before execution.

```bash
# See what would happen with a patch release
quick-publish --dry-run --release-type patch

# Preview a custom version release
quick-publish --dry-run --release-type custom --version 1.2.3 --tag beta
```

### `--yes`
Skips all interactive prompts and uses provided or default values. Enables fully automated execution.

```bash
# Automated patch release
quick-publish --yes --release-type patch

# Automated custom release
quick-publish --yes --release-type custom --version 1.2.3 --tag latest
```

### Version and Tag Options

- `--release-type <type>`: `patch`, `minor`, `major`, `prerelease`, or `custom`
- `--version <version>`: Custom version (required when `--release-type=custom`)
- `--tag <tag>`: NPM tag (`latest`, `next`, `beta`, or custom tag name)

## AI Usage Examples

### 1. Preview Changes (Dry Run)
```bash
# AI can run this to see what would happen
quick-publish --dry-run --release-type patch
```

Output:
```
[DRY RUN] Would select version: 0.7.2, tag: latest
[DRY RUN] Would ask: Continue to publish `0.7.2` with tag `latest`? (auto-yes in automated mode)

[DRY RUN] Publish workflow for version 0.7.2 with tag latest:
[DRY RUN] Would execute: npm version 0.7.2
[DRY RUN] Would execute: /path/to/conventional-changelog -p angular -r 2 -i CHANGELOG.md -s
[DRY RUN] Would execute: npm publish --tag=latest
[DRY RUN] Would execute: git add CHANGELOG.md
[DRY RUN] Would execute: git commit -m chore%3A%20changelog%200.7.2
[DRY RUN] Would execute: git push
[DRY RUN] Would execute: git push origin refs/tags/v0.7.2

[DRY RUN] Publish workflow completed. Use --yes to execute.
```

### 2. Automated Execution
```bash
# AI can run this after confirming with dry-run
quick-publish --yes --release-type patch
```

### 3. Custom Version Release
```bash
# For specific version requirements
quick-publish --yes --release-type custom --version 1.0.0 --tag latest
```

### 4. Beta Release
```bash
# For pre-release versions
quick-publish --yes --release-type prerelease --tag beta
```

## AI Workflow Recommendation

1. **Analysis Phase**: AI runs with `--dry-run` to understand what will happen
2. **Confirmation Phase**: AI presents the planned actions to user
3. **Execution Phase**: AI runs with `--yes` and appropriate parameters

```bash
# Step 1: Analyze
quick-publish --dry-run --release-type patch

# Step 2: Execute (after user confirmation)
quick-publish --yes --release-type patch
```

## Error Handling

- Missing `--version` with `--release-type=custom` will throw an error
- Invalid release types will be rejected
- All validation happens before any commands are executed

## Backward Compatibility

All existing functionality remains unchanged. The new options are additive and don't affect the interactive mode when not specified.
