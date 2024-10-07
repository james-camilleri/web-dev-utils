import svelte from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'
import ts from 'typescript-eslint'
import baseConfig from './eslint.base.config.js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    name: 'files',
    files: ['**/*.svelte'],
  },

  {
    name: 'language options',
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        project: true,
        parser: ts.parser,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.svelte'],
      },
    },
  },

  ...svelte.configs['flat/prettier'],
]
