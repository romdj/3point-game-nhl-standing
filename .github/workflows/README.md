# Simplified CI/CD Pipeline Documentation

## Philosophy: Local First, CI for Deployment

This project uses a **"Local First"** approach to avoid redundant work between local development and CI pipelines.

## Responsibility Separation

### 🏠 Local Git Hooks (Fast Feedback - 30-60s)

**Pre-commit** - Fast validation before each commit:
- ✅ Linting (ESLint) 
- ✅ Type checking (TypeScript, Svelte)
- ✅ Unit tests (Jest + Vitest)
- ✅ High severity security audit

**Pre-push** - Comprehensive testing before push (2-3 min):
- ✅ Full build compilation
- ✅ Test coverage reports
- ✅ Dependency health check
- ✅ Docker integration tests (if available)
- ✅ Final security validation

### 🚀 GitHub Actions CI (Deployment Focus - 5-10 min)

**ci.yml** - Production deployment pipeline:
- ✅ Application builds for deployment
- ✅ Docker image creation and registry push
- ✅ Docker Compose integration testing (PRs)
- ✅ Container security scanning (Trivy)
- ✅ CodeQL static analysis (main branch)

### 🤖 Automated Maintenance

**update-dependencies.yml** - Automated dependency management:
- ✅ Weekly dependency updates (main branch only)
- ✅ Automated PR creation with changelogs

## Removed Workflows

These workflows were **removed** to eliminate redundancy:

- ❌ `dependency-review.yml` - Security audit covered by git hooks
- ❌ `docker-ci.yml` - Docker building merged into main CI
- ❌ `build.yml` - Build testing covered by git hooks  
- ❌ `coverage.yml` - Coverage reports covered by git hooks
- ❌ `deploy.yml` - Deployment merged into main CI
- ❌ `docker-deploy.yml` - Deployment merged into main CI

## Benefits

1. **Faster Feedback** - Issues caught in 30-60s locally vs 5-10 min in CI
2. **Reduced CI Costs** - CI only runs deployment-specific tasks
3. **Simpler Pipeline Management** - 2 workflows instead of 8
4. **Better Developer Experience** - Know issues before pushing
5. **Reliable Deployments** - Comprehensive validation before any push

## Workflow Triggers

- **Pre-commit**: Every commit
- **Pre-push**: Every push attempt  
- **CI**: Pull requests and pushes to main/dev branches
- **Updates**: Weekly on main branch

## Development Workflow

```bash
# Developer makes changes
git add .
# → Pre-commit runs (30-60s) - lint, types, tests, security

git commit -m "feat: new feature"
git push
# → Pre-push runs (2-3m) - build, coverage, integration tests
# → CI runs (5-10m) - deployment, container security, static analysis
```

This approach ensures quality at every step while minimizing redundant work and CI pipeline complexity.