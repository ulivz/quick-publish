/**
 * Module dependencies
 */
import inquirer from 'inquirer';
import { selectVersionAndTag } from './select-version';
import { exec } from './shared';
import { COMMANDS } from './commands';
import type { IOptions } from './types';

/**
 * Release a npm package.
 *
 * Built for standard publish of **single** repository.
 */
export async function publish(opts: IOptions = {}) {
  opts = {
    depcost: false,
    push: true,
    dryRun: false,
    yes: false,
    ...opts,
  };

  /**
   * 1. Select version and tag.
   */
  const { version, tag } = await selectVersionAndTag(
    require(`${process.cwd()}/package.json`).version,
    {
      yes: opts.yes,
      dryRun: opts.dryRun,
      releaseType: opts.releaseType,
      version: opts.version,
      tag: opts.tag,
    },
  );

  /**
   * 2. Double check (skip in automated mode).
   */
  let continueTo = true;
  if (!opts.yes && !opts.dryRun) {
    const result = await inquirer.prompt<{
      continueTo: boolean;
    }>({
      type: 'confirm',
      name: 'continueTo',
      message: `Continue to publish \`${version}\` with tag \`${tag}\`?`,
    });
    continueTo = result.continueTo;
  } else if (opts.dryRun) {
    console.log(`[DRY RUN] Would ask: Continue to publish \`${version}\` with tag \`${tag}\`? (auto-yes in automated mode)`);
  }

  /**
   * 3. Publish workflow.
   */
  if (continueTo) {
    if (opts.dryRun) {
      console.log(`\n[DRY RUN] Publish workflow for version ${version} with tag ${tag}:`);
    }
    
    await exec(COMMANDS.bumpVersion(version), opts.dryRun);
    await exec(COMMANDS.changelog(), opts.dryRun);
    await exec(COMMANDS.npmPublish(tag), opts.dryRun);
    await exec(COMMANDS.gitAdd('CHANGELOG.md'), opts.dryRun);
    await exec(COMMANDS.gitCommit(`chore: changelog ${version}`), opts.dryRun);
    
    if (opts.depcost) {
      await exec(COMMANDS.depcost(), opts.dryRun);
      await exec(COMMANDS.gitAdd('DEPCOST.md'), opts.dryRun);
      await exec(COMMANDS.gitCommit(`chore: DEPCOST.md ${version}`), opts.dryRun);
    }
    
    if (opts.push) {
      await exec(COMMANDS.gitPush(), opts.dryRun);
      await exec(COMMANDS.gitPushTag(`v${version}`), opts.dryRun);
    }
    
    if (opts.dryRun) {
      console.log(`\n[DRY RUN] Publish workflow completed. Use --yes to execute.`);
    } else {
      console.log(`\nPublish completed: ${version} with tag ${tag}`);
    }
  } else {
    console.log('Publish cancelled');
  }
}
