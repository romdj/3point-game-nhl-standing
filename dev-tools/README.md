# Development Tools

This directory contains utilities and scripts for development, debugging, and testing the NHL standings application.

## Structure

```
dev-tools/
├── README.md                    # This file
├── api/                         # API testing and debugging tools
│   ├── graphql-tester.ts       # GraphQL connection testing
│   └── nhl-api-explorer.ts     # NHL API data exploration
├── debugging/                   # Debug utilities
│   ├── frontend-debugger.ts    # Frontend state debugging
│   └── data-flow-tracer.ts     # Data flow analysis
├── scripts/                     # Automation scripts
│   ├── test-data-generator.ts  # Generate test data
│   └── season-data-updater.ts  # Update season configurations
└── utils/                       # Shared utilities for dev tools
    ├── logger.ts               # Enhanced logging
    └── test-helpers.ts         # Common test helpers
```

## Usage

### API Testing
```bash
# Test GraphQL connection
npm run dev:test-graphql

# Explore NHL API data
npm run dev:explore-api
```

### Debugging
```bash
# Debug frontend state
npm run dev:debug-frontend

# Trace data flow
npm run dev:trace-data
```

### Scripts
```bash
# Generate test data
npm run dev:generate-test-data

# Update season configurations
npm run dev:update-seasons
```

## Adding New Tools

1. Choose the appropriate subdirectory based on the tool's purpose
2. Create a TypeScript file with a descriptive name
3. Add a brief comment at the top explaining the tool's purpose
4. Export functions that can be imported or run directly
5. Update this README with usage instructions
6. Add corresponding npm scripts to package.json if needed

## Guidelines

- Keep tools focused on a single purpose
- Use TypeScript for type safety
- Include error handling and clear logging
- Document any external dependencies
- Test tools before committing