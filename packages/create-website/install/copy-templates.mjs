import { fileURLToPath } from 'url'

import degit from 'degit'

import { copyDir, deleteFiles } from '../utils/file.mjs'

export async function copyTemplates(config, cwd) {
  await Promise.all(
    config.map(async (config) => {
      const { dest, githubSrc, remove = [], template } = config

      if (githubSrc) {
        await degit(githubSrc, { force: true }).clone(dest)
      }

      await copyDir(fileURLToPath(new URL(`../templates/${template}`, import.meta.url).href), dest)

      await deleteFiles(remove, dest)
    }),
  )

  await copyDir(fileURLToPath(new URL(`../templates/workspace`, import.meta.url).href), cwd)
}
