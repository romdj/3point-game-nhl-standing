import { 
  baseEslintConfig, 
  baseTypeScriptConfig, 
  baseTestConfig, 
  baseIgnoreConfig,
  nodeGlobals, 
  jestGlobals 
} from '../shared/eslint.config.base.js';

export default [
  baseEslintConfig,
  {
    ...baseTypeScriptConfig,
    languageOptions: {
      ...baseTypeScriptConfig.languageOptions,
      globals: {
        ...nodeGlobals,
      },
    },
  },
  {
    ...baseTestConfig,
    languageOptions: {
      globals: {
        ...nodeGlobals,
        ...jestGlobals,
      },
    },
  },
  baseIgnoreConfig,
];