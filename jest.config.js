// Jest Configuration for Word Club
module.exports = {
  // Use jsdom to simulate browser environment
  testEnvironment: 'jsdom',

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.jsx',
    '**/tests/**/*.test.js'
  ],

  // Ignore these patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/app.test.js',
    '/tests/integration.test.js',
    '/tests/react-lint.test.js'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'index.html',
    '!**/node_modules/**',
    '!**/tests/**'
  ],

  // Coverage thresholds
  coverageThresholds: {
    global: {
      statements: 50,
      branches: 45,
      functions: 50,
      lines: 50
    }
  },

  // Transform configuration (for ES modules)
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },

  // Module name mapper for CDN imports
  moduleNameMapper: {
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom'
  },

  // Verbose output
  verbose: true,

  // Timeout for tests
  testTimeout: 10000
};
