import { defineConfig } from 'oxfmt'

import { sortImports } from './_sort-order.js'

export default defineConfig({
  ignorePatterns: ['**/.astro/', '**/.svelte-kit/', '**/.changeset/', '**/dist/', '**/.sanity/'],

  semi: false,
  singleQuote: true,
  svelte: true,

  sortImports,
})
