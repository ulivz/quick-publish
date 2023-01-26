/**
 * Module dependencies
 */
import type semver from 'semver';

/**
 * Standard release type.
 */
export type ReleaseType = semver.ReleaseType;
/**
 * Custom release type.
 */
export type CustomReleaseType = 'custom';
/**
 * Definition of publish options
 */
export interface IOptions {
  /**
   * Generate or update `DEPCOST.md`, defaults to `true`
   */
  depcost?: boolean;
  /**
   * Execute git push & tag push to remote git origin, defaults to `true`
   */
  push?: boolean;
}
/**
 * Definition of versions candidate.
 */
export type VersionCandidate = Partial<Record<semver.ReleaseType, string>>;
/**
 * Definition of release prompt answers.
 */
export interface IPromptAnswers {
  releaseType: ReleaseType | CustomReleaseType;
  customVersion: string;
  npmTag: string;
  customNpmTag: string;
}
/**
 * Definition of result for selectVersionAndTag.
 */
export interface ISelectVersionAndTagResult {
  tag: string;
  version: string;
}
