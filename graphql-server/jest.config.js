export default {
  // Specifies the preset configuration for TypeScript ESM support
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true
    }]
  },
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Look for test files in `spec.ts` and `test.ts` files
  testMatch: [
    '<rootDir>/tests/**/*.spec.ts',
    '<rootDir>/tests/**/*.test.ts',
  ],

  // The environment that will be used for testing
  testEnvironment: 'node',
  
  // Provide global variables
  globals: {
    'ts-jest': {
      useESM: true
    }
  },

  // Automatically reset mock state between every test
  resetMocks: true,

  // Automatically restore mock state between every test
  restoreMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // A list of file extensions that Jest will scan for tests and modules
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // Transform ESM imports for compatibility
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Coverage collection configuration
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/index.ts',
    '!src/**/config.{js,ts}',
  ],

  // Coverage reporting formats
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary',
    'cobertura'
  ],

  // Coverage thresholds that must be met (lowered for initial setup)
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },

  // Map module aliases if needed
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
  },

  // Setup files to run before tests
  setupFiles: ['dotenv/config'],

  // Test execution options
  verbose: true,
  bail: 1,
  forceExit: true,
  detectOpenHandles: true,
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/src/',
    '/tests/.*\\.disabled/',
  ],
};
