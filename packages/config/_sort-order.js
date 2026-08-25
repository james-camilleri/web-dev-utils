// This is shared between oxfmt and eslint, so files that can't
// be formatted with oxfmt will have the same sort order.
export const sortImports = {
  groups: [
    'type',
    'builtin',
    'external',
    'internal',
    'unknown',
    'parent',
    'sibling',
    'index',
    'style',
  ],
}
