import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';

export const baseEslintConfig = js.configs.recommended;

export const baseTypeScriptConfig = {
  files: ['**/*.ts', '**/*.js'],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': typescript,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['error'] }],
  },
};

export const baseTestConfig = {
  files: ['**/*.test.ts', '**/*.spec.ts'],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};

export const baseIgnoreConfig = {
  ignores: ['dist/', 'build/', '.svelte-kit/', 'node_modules/', 'coverage/'],
};

export const nodeGlobals = globals.node;
export const browserGlobals = globals.browser;
export const jestGlobals = globals.jest;