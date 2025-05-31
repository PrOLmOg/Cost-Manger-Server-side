// jest.config.js
const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  // use ts-jest for both TS *and* plain JS, with ESM output
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { useESM: true, tsconfig: { allowJs: true } }],
  },
  testEnvironment: 'node',
  preset: 'ts-jest',                                // core preset
  moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' },
};
