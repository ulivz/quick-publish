/**
 * Module dependencies
 */
import inquirer from 'inquirer';
import semver from 'semver';
import type { ISelectVersionAndTagResult, VersionCandidate, IPromptAnswers, ReleaseType } from './types';

/**
 * Select version and tag to be released.
 */
export async function selectVersionAndTag(
  currentVersion: string,
): Promise<ISelectVersionAndTagResult> {
  const customItem = { name: 'Custom', value: 'custom' };

  /**
   * Determine release types by current version.
   */
  const releaseTypes: semver.ReleaseType[] = isPreRelease(currentVersion)
    ? ['prerelease', 'patch', 'minor', 'major']
    : ['patch', 'minor', 'major', 'prerelease'];

  /**
   * Build version candidate by release types.
   */
  const versionCandidate: VersionCandidate
    = releaseTypes.reduce<VersionCandidate>((memo, releaseType) => {
      memo[releaseType] = semver.inc(currentVersion, releaseType);
      return memo;
    }, {});

  /**
   * Determine version by answers
   */
  function getVersion(answers: IPromptAnswers) {
    return (
      answers.customVersion
      || versionCandidate[answers.releaseType as ReleaseType]
    );
  }

  /**
   * Determine npm tags candidates by version
   */
  function getNpmTags(version: string) {
    if (isPreRelease(version)) {
      return ['next', 'latest', 'beta', customItem];
    }
    return ['latest', 'next', 'beta', customItem];
  }

  /**
   * Check prerelease
   */
  function isPreRelease(version: string) {
    return Boolean(semver.prerelease(version));
  }

  const bumpChoices = releaseTypes.map(b => ({
    name: `${b} (${versionCandidate[b]})`,
    value: b,
  }));

  const { releaseType, customVersion, npmTag, customNpmTag }
    = await inquirer.prompt<IPromptAnswers>([
      {
        name: 'releaseType',
        message: 'Select release type:',
        type: 'list',
        choices: [...bumpChoices, customItem],
      },
      {
        name: 'customVersion',
        message: 'Input version:',
        type: 'input',
        when: answers => answers.releaseType === 'custom',
      },
      {
        name: 'npmTag',
        message: 'Input npm tag:',
        type: 'list',
        default: (answers: IPromptAnswers) => getNpmTags(getVersion(answers))[0],
        choices: answers => getNpmTags(getVersion(answers)),
      },
      {
        name: 'customNpmTag',
        message: 'Input customized npm tag:',
        type: 'input',
        when: answers => answers.npmTag === 'custom',
      },
    ]);

  const version
    = customVersion || versionCandidate[releaseType as ReleaseType];
  const tag = customNpmTag || npmTag;

  return {
    tag,
    version,
  };
}
