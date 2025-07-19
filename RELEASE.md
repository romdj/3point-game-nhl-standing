# Release Guide

This guide outlines the release process for the NHL 3-Point Standings application, a monorepo containing a GraphQL server and SvelteKit frontend.

## 📋 Quick Reference

| Command | Description |
|---------|-------------|
| `npm run version:bump:patch` | Bump patch version (0.2.0 → 0.2.1) |
| `npm run version:bump:minor` | Bump minor version (0.2.0 → 0.3.0) |
| `npm run version:bump:major` | Bump major version (0.2.0 → 1.0.0) |
| `npm run release:prepare` | Full pre-release validation |
| `npm run release:branch` | Create release branch |
| `npm run release:tag` | Create and push git tag |

## 🚀 Release Process

### 1. Pre-Release Preparation

Before creating a release, ensure your working directory is clean and all changes are committed:

```bash
# Check git status
git status

# Commit any pending changes
git add .
git commit -m "feat: final changes for release"
```

### 2. Version Bump

Choose the appropriate version bump based on the changes:

- **Patch** (0.2.0 → 0.2.1): Bug fixes, small improvements
- **Minor** (0.2.0 → 0.3.0): New features, backward-compatible changes
- **Major** (0.2.0 → 1.0.0): Breaking changes

```bash
# Example: bump minor version
npm run version:bump:minor
```

This script will:
- ✅ Update version in all package.json files (root, graphql-server, frontend)
- ✅ Keep all workspace versions synchronized
- ✅ Display next steps

### 3. Commit Version Changes

```bash
# Review the version changes
git diff

# Commit the version bump
git add .
git commit -m "chore: bump version to v0.3.0"
```

### 4. Release Validation

Run comprehensive pre-release checks:

```bash
npm run release:prepare
```

This command performs:
- 🧹 Clean build artifacts
- 📦 Fresh dependency installation
- 🏗️ Build all packages
- 🧪 Run complete test suite
- 🔍 Code quality checks (lint + typecheck)
- 🔒 Security audit

**If any step fails, fix the issues before proceeding.**

### 5. Create Release Branch

```bash
npm run release:branch
```

This creates a new branch named `release/vX.X.X` and switches to it.

### 6. Push Release Branch

```bash
# Push the release branch to remote
git push origin release/v0.3.0

# Create Pull Request: release/v0.3.0 → main
```

### 7. Merge to Main

1. Create a Pull Request from `release/v0.3.0` to `main`
2. Get required approvals
3. Merge the PR (use "Squash and merge" or "Merge commit")

### 8. Tag the Release

After the PR is merged to main:

```bash
# Switch to main and pull latest
git checkout main
git pull origin main

# Create and push the release tag
npm run release:tag
```

### 9. Automated Release (Optional)

If using semantic-release for automated GitHub releases:

```bash
npm run semantic-release
```

This will:
- Generate changelog from conventional commits
- Create GitHub release with release notes
- Publish packages (if configured)

## 🔄 Hotfix Process

For urgent fixes that need to bypass the normal release cycle:

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/fix-critical-bug

# Make your fixes
git add .
git commit -m "fix: resolve critical security issue"

# Bump patch version
npm run version:bump:patch

# Commit version bump
git add .
git commit -m "chore: bump version to v0.3.1"

# Push and create PR directly to main
git push origin hotfix/fix-critical-bug
```

## 🛠️ Manual Version Management

If you need to manually adjust versions:

### Update All Packages to Specific Version

```bash
# Use the bump script with any version type
node scripts/bump-version.js patch
node scripts/bump-version.js minor  
node scripts/bump-version.js major
```

### Manual Package.json Updates

Edit the following files to keep versions in sync:
- `/package.json` (root)
- `/graphql-server/package.json`
- `/frontend/package.json`

## 📝 Version Strategy

This project follows [Semantic Versioning](https://semver.org/):

### Major Version (X.0.0)
- Breaking changes to API
- Database schema changes requiring migration
- Removal of deprecated features
- Changes requiring user action

### Minor Version (0.X.0)
- New features
- New GraphQL queries/mutations
- New UI components or pages
- Performance improvements
- Backward-compatible changes

### Patch Version (0.0.X)
- Bug fixes
- Security patches
- Documentation updates
- Dependency updates
- Minor styling improvements

## 🚨 Troubleshooting

### Release Preparation Fails

If `npm run release:prepare` fails:

1. **Build failures**: Check for TypeScript errors or missing dependencies
2. **Test failures**: Fix failing tests before proceeding
3. **Lint errors**: Run `npm run fix` to auto-fix formatting issues
4. **Security vulnerabilities**: Review and address using `npm audit fix`

### Version Conflicts

If versions get out of sync:

```bash
# Reset to a clean state
npm run clean
npm install

# Run version bump again
npm run version:bump:patch
```

### Git Issues

If you encounter git issues during release:

```bash
# Check current status
git status

# Abort current merge/rebase if needed
git merge --abort
# or
git rebase --abort

# Reset to last known good state
git reset --hard HEAD~1
```

## 📚 Additional Resources

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://semantic-release.gitbook.io/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)

## 🤝 Contributing

When contributing to releases:

1. Follow the conventional commit format
2. Update documentation if needed
3. Add tests for new features
4. Ensure all CI checks pass
5. Get required code reviews

For questions about the release process, please create an issue or reach out to the maintainers.