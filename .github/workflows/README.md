# NHL Standings GitHub Actions Workflows

This directory contains GitHub Actions workflows for the NHL Standings application with both traditional and Docker-based CI/CD pipelines.

## Workflows Overview

### Core CI/CD Workflows

#### 1. **ci.yml** - Traditional CI Pipeline
- **Triggers**: Pull requests and pushes to main branches
- **Jobs**: 
  - Install dependencies with caching
  - Lint and type checking
  - Cross-platform testing (Ubuntu, macOS, Windows)
  - Build verification
  - Security audit
  - Docker validation (PRs only)
- **Features**: Optimized for monorepo with dependency caching

#### 2. **docker-ci.yml** - Container CI Pipeline ⭐ **NEW**
- **Triggers**: Pull requests and pushes to main, dev branches
- **Jobs**:
  - Multi-stage Docker builds for frontend and server
  - Container security scanning with Trivy
  - Push to GitHub Container Registry (ghcr.io)
  - Docker Compose testing (production and development)
  - Consistency testing in containerized environments
- **Features**: Multi-architecture builds, SARIF security reporting

#### 3. **build.yml** - Cross-Platform Build & Test
- **Triggers**: Pull requests and pushes to all branches
- **Jobs**: Build and test across multiple operating systems
- **Features**: Matrix builds with coverage reporting on Ubuntu

#### 4. **coverage.yml** - Coverage Reporting
- **Triggers**: Pull requests and pushes to main branches
- **Jobs**: Generate and report test coverage for both GraphQL server and frontend
- **Features**: PR comments with coverage reports, Codecov integration

#### 5. **release.yml** - Automated Releases
- **Triggers**: Pushes to main branch
- **Jobs**: Build, test, and create semantic releases
- **Features**: Automated versioning and changelog generation

### Deployment Workflows

#### 6. **deploy.yml** - Traditional Deployment
- **Triggers**: Pushes to main branch or manual dispatch
- **Jobs**: Deploy to staging/production environments
- **Features**: Environment-specific deployments with Docker deployment examples

#### 7. **docker-deploy.yml** - Container Deployment ⭐ **NEW**
- **Triggers**: Pushes to main branch or manual dispatch
- **Jobs**:
  - Production container builds and pushes
  - Environment-specific container deployments
  - Health checks and smoke tests
  - Automated rollback on failure
- **Features**: Blue-green deployment, Kubernetes examples, notification system

#### 8. **dependency-review.yml** - Dependency Management
- **Triggers**: Changes to package.json files
- **Jobs**: Review dependencies, audit for vulnerabilities, check licenses
- **Features**: Automated dependency security and compliance checks

## Monorepo Adaptations

### Dependency Management
- Uses `npm install` (root) instead of `npm run install:all`
- Leverages npm workspaces for efficient dependency management
- Shared dependencies are installed at the root level

### Caching Strategy
- Caches `node_modules` for all workspaces
- Uses `package-lock.json` hash for cache keys
- Reduces build times significantly

### Build Artifacts
- Collects build outputs from all workspaces:
  - `graphql-server/dist`
  - `frontend/build`
  - `frontend/.svelte-kit/output`

### Environment Configuration
- Supports multiple environments (staging, production)
- Uses GitHub environments for deployment protection
- Centralized environment variable management

## Environment Variables

### Required Secrets
- `CODECOV_TOKEN`: For coverage reporting
- `GITHUB_TOKEN`: For releases and deployments (automatically provided)
- `NPM_TOKEN`: For package publishing (if needed)

### Optional Secrets
- Deployment-specific credentials
- Notification service tokens

## Path Filters

Workflows are optimized with path filters to avoid unnecessary runs:
- Ignores `**.md` and `docs/**` for most workflows
- Dependency review only runs on package.json changes
- Deployment only runs on code changes

## Matrix Builds

Cross-platform testing ensures compatibility:
- **Ubuntu**: Full test suite with coverage
- **macOS**: Test suite only
- **Windows**: Test suite only

## Artifacts

Build artifacts are stored with appropriate retention:
- Development builds: 1 day
- Deployment builds: 7 days
- Release builds: As per GitHub defaults

## Security

- Uses trusted actions with pinned versions
- Implements security audits
- Reviews dependencies for vulnerabilities
- Checks licenses for compliance

## Performance Optimizations

- Dependency caching across jobs
- Parallel job execution
- Conditional job execution based on changes
- Efficient artifact handling

## Monitoring

- Job summaries with detailed reports
- PR comments for coverage and dependency changes
- Notification support for deployment status
- Health checks post-deployment