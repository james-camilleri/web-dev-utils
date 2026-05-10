import sanity from '@sanity/eslint-config-studio'

import baseConfig from './eslint.base.config.js'

/** @type {import('eslint').Linter.Config[]} */
export default [...baseConfig, ...sanity]
