/**
 * Module dependencies
 */
import path from 'path'

/**
 * Resolve local-installed bin
 */
const bin = (name: string) =>
  path.resolve(__dirname, `../node_modules/.bin/${name}`)

/**
 * Internal inline commands
 */
export const COMMANDS = {
  bumpVersion: (version: string) => `npm version ${version}`,
  npmPublish: (tag: string) => `npm publish --tag=${tag}`,
  gitAdd: (file: string) => `git add ${file}`,
  gitAddAll: () => `git add .`,
  gitCommit: (message: string) =>
    `git commit -m ${encodeURIComponent(message)}`,
  gitPush: () => `git push`,
  gitPushTag: (tag: string) => `git push origin refs/tags/${tag}`,
  changelog: () =>
    `${bin('conventional-changelog')} -p angular -r 2 -i CHANGELOG.md -s`,
  depcost: () => `${bin('depcost')} --record --npm-client=npm`,
}
