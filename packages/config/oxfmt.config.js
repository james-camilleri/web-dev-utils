import { defineConfig } from 'oxfmt'

import { sortImports } from './_sort-order.js'

export default defineConfig({
  semi: false,
  singleQuote: true,

  ignorePatterns: ['**/.astro/', '**/.svelte-kit/', '**/.changeset/', '**/dist/', '**/.sanity/'],

  sortImports,
})
