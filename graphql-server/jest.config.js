module.exports = {
  // Specifies the preset configuration for TypeScript support
  preset: 'ts-jest',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Look for test files in `spec.ts` files
  testMatch: ['**/*.spec.ts'],

  // The environment that will be used for testing (can be 'node' or 'jsdom')
  testEnvironment: 'node',

  // Automatically reset mock state between every test
  resetMocks: true,

  // Automatically restore mock state between every test
  restoreMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // A list of file extensions that Jest will scan for tests and modules
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // Transform TypeScript files with ts-jest
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Specify coverage report options
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],

  // Map module aliases if needed, e.g., "@app" to "src"
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
  },
};
