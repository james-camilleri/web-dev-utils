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

  {
    name: 'turn off no-unresolved',
    // This is a nightmare to get working correctly as the types for svelte aliases won't load
    // at the root and oxlint doesn't support it anyway so it'll go the way of the dodo soon.
    rules: {
      'import-x/no-unresolved': ['off'],
    },
  },

  ...svelte.configs['flat/recommended'],
  ...svelte.configs['flat/prettier'],
]
