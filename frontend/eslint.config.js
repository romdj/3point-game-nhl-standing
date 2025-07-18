import { 
  baseEslintConfig, 
  baseTypeScriptConfig, 
  baseTestConfig, 
  baseIgnoreConfig,
  browserGlobals, 
  nodeGlobals 
} from '../shared/eslint.config.base.js';
import svelte from 'eslint-plugin-svelte';
import typescriptParser from '@typescript-eslint/parser';

export default [
  baseEslintConfig,
  ...svelte.configs['flat/recommended'],
  {
    ...baseTypeScriptConfig,
    languageOptions: {
      ...baseTypeScriptConfig.languageOptions,
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
      },
    },
    rules: {
      ...baseTypeScriptConfig.rules,
      'no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-console': ['warn', { allow: ['error', 'warn', 'info', 'debug', 'trace'] }],
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: typescriptParser,
      },
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
    },
  },
  {
    ...baseTestConfig,
    languageOptions: {
      parser: typescriptParser,
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },
  baseIgnoreConfig,
];