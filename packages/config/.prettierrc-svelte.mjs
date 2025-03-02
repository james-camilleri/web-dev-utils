import prettierConfig from './.prettierrc.mjs'

export default {
  ...prettierConfig,
  plugins: [...(prettierConfig.plugins || []), 'prettier-plugin-svelte'],
  overrides: [
    ...(prettierConfig.overrides || []),
    { files: '*.svelte', options: { parser: 'svelte' } },
  ],
}
