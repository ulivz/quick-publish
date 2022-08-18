/**
 * Module dependencies
 */
import execa from "execa";

/**
 * Execute a inline command.
 *
 * @param command
 * @returns
 */
export function exec(command: string) {
  const splits = command.split(" ");
  return execa(
    splits[0],
    splits.slice(1).map((v) => decodeURIComponent(v)),
    { stdio: "inherit" }
  );
}
