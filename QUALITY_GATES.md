# Quality Gates & Code Standards

This document outlines the quality gates and code standards enforced in this project to ensure high code quality, maintainability, and reliability.

## 🛡️ Pre-commit Hooks

Pre-commit hooks automatically run before each commit to catch issues early:

### Setup
```bash
# Install pre-commit (requires Python)
pip install pre-commit

# Install hooks
pre-commit install
```

### Enabled Hooks
- **Code Formatting**: Prettier for consistent code style
- **Linting**: ESLint for both GraphQL server and Svelte frontend
- **Type Checking**: TypeScript compilation checks
- **Security**: Secret detection with detect-secrets
- **General**: Trailing whitespace, large files, merge conflicts
- **Commit Messages**: Conventional commits format validation

## 📊 Coverage Requirements

### Minimum Thresholds

#### GraphQL Server (Jest)
- **Global**: 80% lines, branches, functions, statements
- **Resolvers**: 85% lines, branches, functions, statements  
- **Utils**: 90% lines, branches, functions, statements

#### Svelte Frontend (Vitest)
- **Global**: 80% lines, branches, functions, statements
- **Utils**: 90% lines, branches, functions, statements
- **Stores**: 85% lines, branches, functions, statements
- **API**: 85% lines, branches, functions, statements

### Coverage Commands
```bash
# Run coverage for all projects
npm run test:coverage

# Individual project coverage
npm run test:coverage:server
npm run test:coverage:frontend
```

## 🚀 GitHub Actions Workflows

### Build & Test Pipeline
Runs on every push and pull request:
- ✅ Dependency installation
- ✅ Code compilation/build
- ✅ Test execution with coverage
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Coverage threshold validation

### Coverage Pipeline
Dedicated coverage reporting:
- 📊 Coverage report generation
- 📈 Codecov integration
- 💬 PR comments with coverage details
- ⚠️ Threshold enforcement

### Security & Quality
- 🔒 Secret detection
- 📝 Conventional commit validation
- 🧹 Code formatting checks

## 🎯 Quality Standards

### Code Style
- **Formatting**: Prettier with project configuration
- **Linting**: ESLint with TypeScript rules
- **Naming**: Descriptive variable and function names
- **Comments**: JSDoc for public APIs

### Testing Requirements
- **Unit Tests**: All utility functions and business logic
- **Integration Tests**: API endpoints and data flows
- **Component Tests**: UI components and user interactions
- **Coverage**: Meet minimum thresholds for all areas

### Type Safety
- **Strict TypeScript**: No implicit any, strict null checks
- **Interface Definitions**: Clear type definitions for all data
- **Error Handling**: Proper error types and handling

### Performance
- **Bundle Size**: Monitor and optimize frontend bundles
- **Memory Usage**: Prevent memory leaks in server code
- **Response Times**: API performance monitoring

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

### Code Quality
- [ ] Code follows project style guidelines
- [ ] ESLint passes without errors
- [ ] TypeScript compiles without errors
- [ ] Pre-commit hooks pass

### Testing
- [ ] All tests pass locally
- [ ] New code has appropriate test coverage
- [ ] Coverage thresholds are met
- [ ] Manual testing completed for UI changes

### Documentation
- [ ] Code is self-documenting or commented
- [ ] README updated if needed
- [ ] API changes documented

### Security
- [ ] No secrets or sensitive data committed
- [ ] Dependencies are up to date
- [ ] Security best practices followed

## 🛠️ Tools & Configuration

### Testing Frameworks
- **GraphQL Server**: Jest with ts-jest
- **Svelte Frontend**: Vitest with happy-dom

### Linting & Formatting
- **ESLint**: v9 with flat config format
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict configuration

### Coverage Tools
- **Jest**: Built-in coverage with v8
- **Vitest**: @vitest/coverage-v8
- **Codecov**: Coverage reporting and tracking

### Pre-commit Framework
- **detect-secrets**: Secret detection
- **pre-commit-hooks**: General file checks
- **conventional-pre-commit**: Commit message validation

## 🔧 Configuration Files

- `.pre-commit-config.yaml` - Pre-commit hooks configuration
- `jest.config.js` - Jest configuration with coverage thresholds
- `vite.config.ts` - Vitest configuration with coverage settings
- `eslint.config.js` - ESLint configuration for both projects
- `.github/workflows/` - CI/CD pipeline definitions

## 📈 Monitoring & Reporting

### Coverage Reports
- **HTML Reports**: Generated in `coverage/` directories
- **LCOV Format**: For external tools integration
- **JSON Summary**: For programmatic access

### GitHub Integration
- **Status Checks**: Required for PR merging
- **Coverage Comments**: Automatic PR comments with coverage details
- **Failure Notifications**: Immediate feedback on quality gate failures

## 🎓 Best Practices

### Writing Tests
- Use descriptive test names
- Test both happy path and edge cases
- Mock external dependencies appropriately
- Keep tests fast and isolated

### Code Organization
- Separate concerns clearly
- Use appropriate design patterns
- Keep functions small and focused
- Follow SOLID principles

### Git Workflow
- Use conventional commit messages
- Keep commits atomic and focused
- Write meaningful commit descriptions
- Rebase before merging to keep history clean