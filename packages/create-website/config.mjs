export default {
  'svelte-kit': {
    githubSrc: 'sveltejs/kit/packages/create-svelte/templates/skeleton',
    remove: [
      '.ignore',
      '.meta.json',
      'package.template.json',
      '/static/favicon.png',
    ],
    replace: ['package.json', 'src/config.js'],
    dependencies: ['@sanity/client', 'nodemailer'],
    devDependencies: [
      '@poppanator/sveltekit-svg',
      '@portabletext/svelte',
      '@rollup/plugin-replace',
      '@sveltejs/adapter-auto',
      '@sveltejs/kit',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'env-cmd',
      'eslint-config-prettier',
      'eslint-plugin-svelte3',
      'eslint',
      'prettier-plugin-svelte',
      'prettier',
      'sass',
      'svelte-check',
      'svelte-inline-svg',
      'svelte-preprocess',
      'svelte',
      'tslib',
      'typescript',
    ],
  },
  sanity: {
    replace: ['package.json'],
    dependencies: [
      '@james-camilleri/replace-sanity-favicon',
      '@james-camilleri/sanity-web-image',
      '@james-camilleri/slack-logger',
      '@netlify/functions',
    ],
  },
}
