/**
 * Module dependencies
 */
import execa from 'execa';

/**
 * Execute a inline command.
 *
 * @param command
 * @param dryRun - If true, only log the command without executing
 * @returns
 */
export function exec(command: string, dryRun: boolean = false) {
  if (dryRun) {
    console.log(`[DRY RUN] Would execute: ${command}`);
    return Promise.resolve({ stdout: '', stderr: '', exitCode: 0 });
  }
  
  const splits = command.split(' ');
  return execa(
    splits[0],
    splits.slice(1).map(v => decodeURIComponent(v)),
    { stdio: 'inherit' },
  );
}
