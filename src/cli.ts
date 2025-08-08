/**
 * Module dependencies
 */
import CAC from 'cac';
import { publish } from './index';

/**
 * Bootstrap publish cli.
 */
export function bootstrapCli() {
  const cli = CAC();
  const pkg = require('../package.json');

  cli
    .command('', pkg.description)
    .option('--depcost', 'Generate or update `DEPCOST.md`, defaults to `false`')
    .option(
      '--push',
      'Execute git push & tag push to remote git origin, defaults to `true`',
    )
    .option(
      '--dry-run',
      'Show what would be executed without actually running commands',
    )
    .option(
      '--yes',
      'Skip all prompts and use default values for automated execution',
    )
    .option(
      '--release-type <type>',
      'Release type: patch, minor, major, prerelease, or custom',
    )
    .option(
      '--version <version>',
      'Custom version (required when --release-type=custom)',
    )
    .option(
      '--tag <tag>',
      'NPM tag: latest, next, beta, or custom tag name',
    )
    .action(opts => {
      publish(opts);
    });

  /**
   * Display help message when `-h` or `--help` appears
   */
  cli.help();

  /**
   * Display version number when `-v` or `--version` appears
   * It's also used in help message
   */
  cli.version(pkg.version);

  cli.parse();
}
