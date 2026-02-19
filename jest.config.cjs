module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  // tests/e2e/ は Playwright/Cucumber が担当するため Jest では除外
  testPathIgnorePatterns: ['/node_modules/', 'tests/e2e/'],
  globals: {
    'ts-jest': {
      // 型チェックは tsc --noEmit で行うため Jest では無効化
      diagnostics: false,
    },
  },
  collectCoverageFrom: [
    'src/utils/**/*.{ts,tsx}',
    'src/hooks/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
};
