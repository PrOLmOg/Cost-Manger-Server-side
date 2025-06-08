// eslint.config.cjs   (flat-config, CommonJS style)
const jsdoc    = require('eslint-plugin-jsdoc');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    files: ['src/**/*.{ts,js}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': tseslint, jsdoc },
    rules: {
      /* core rules */
     'no-unused-vars': [
     'warn',
    {
     argsIgnorePattern: '^_',          // ignores unused function params like _next
     caughtErrorsIgnorePattern: '^_',  // ignores unused catch params like _error
    },
   ],

      /* TS overrides */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'warn',

      /* JSDoc */
      'jsdoc/require-jsdoc': ['warn', { publicOnly: true }],
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
    },
  },
];
