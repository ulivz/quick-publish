/**
 * Module dependencies
 */
import inquirer from 'inquirer'
import { selectVersionAndTag } from './select-version'
import { exec } from './shared'
import { COMMANDS } from './commands'
import type { Publish } from './types'

/**
 * Release a npm package.
 *
 * Built for standard publish of **single** repository.
 */
export async function publish(opts: Publish.IOptions = {}) {
  opts = {
    depcost: false,
    push: true,
    ...opts,
  }

  /**
   * 1. Select version and tag.
   */
  const { version, tag } = await selectVersionAndTag(
    require(`${process.cwd()}/package.json`).version
  )

  /**
   * 2. Double check.
   */
  const { gitAddAllFiles, continueTo } = await inquirer.prompt<{
    addAll: boolean
    continueTo: boolean
  }>(
    {
      type: 'confirm',
      name: 'gitAddAllFiles',
      message: 'Want add all files to working area',
    },
    {
      type: 'confirm',
      name: 'continueTo',
      message: `Continue to publish \`${version}\` with tag \`${tag}\`?`,
    }
  )

  /**
   * 3. Publish workflow.
   */
  if (continueTo) {
    if (gitAddAllFiles) {
      await exec(COMMANDS.gitAddAll())
    }
    await exec(COMMANDS.bumpVersion(version))
    await exec(COMMANDS.changelog())
    await exec(COMMANDS.npmPublish(tag))
    await exec(COMMANDS.gitAdd('CHANGELOG.md'))
    await exec(COMMANDS.gitCommit(`chore: changelog ${version}`))
    if (opts.depcost) {
      await exec(COMMANDS.depcost())
      await exec(COMMANDS.gitAdd('DEPCOST.md'))
      await exec(COMMANDS.gitCommit(`chore: DEPCOST.md ${version}`))
    }
    if (opts.push) {
      await exec(COMMANDS.gitPush())
      await exec(COMMANDS.gitPushTag(`v${version}`))
    }
  } else {
    console.log('Publish cancelled')
  }
}
