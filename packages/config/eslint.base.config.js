import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import-x'
import perfectionist from 'eslint-plugin-perfectionist'
import globals from 'globals'
import ts from 'typescript-eslint'

import { sortImports } from './_sort-order.js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'files',
    files: ['**/*.ts'],
  },
  {
    name: 'ignores',
    ignores: ['.netlify/', '.sanity/', 'build/', 'dist/'],
  },

  {
    name: 'language options',
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
  },

  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,

  {
    name: 'disable type-checked',
    files: ['**/*.js', '**/*.svelte', '.storybook/**'],
    ...ts.configs.disableTypeChecked,
  },

  { name: 'import/recommended', ...importPlugin.flatConfigs.recommended },
  { name: 'import/typescript', ...importPlugin.flatConfigs.typescript },

  {
    name: 'import sorting',
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': ['error', { ...sortImports }],
      'perfectionist/sort-named-imports': [
        'error',
        { groups: ['type-import', 'value-import', 'unknown'] },
      ],
      'perfectionist/sort-named-exports': [
        'error',
        { groups: ['type-import', 'value-import', 'unknown'] },
      ],
    },
  },

  {
    name: 'custom rules',
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  { name: 'prettier', ...prettier },
]
