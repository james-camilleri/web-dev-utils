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
    name: 'ignores',
    ignores: ['.svelte-kit/'],
  },

  {
    name: 'language options (svelte)',
    files: ['**/*.svelte', '**/*.svelte.js', '**/*.svelte.ts'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
  },

  ...svelte.configs['flat/recommended'],
  ...svelte.configs['flat/prettier'],
]
