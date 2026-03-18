/**
 * Constants for AI Signal Clarity detection.
 * Extracted to improve AI signal clarity and maintainability.
 */

export const LINE_THRESHOLD_CRITICAL = 750;
export const LINE_THRESHOLD_MAJOR = 500;

export const CALLBACK_DEPTH_THRESHOLD = 3;

export const CATEGORY_LARGE_FILE = 'large-file';
export const CATEGORY_UNDOCUMENTED_EXPORT = 'undocumented-export';
export const CATEGORY_IMPLICIT_SIDE_EFFECT = 'implicit-side-effect';
export const CATEGORY_AMBIGUOUS_NAME = 'ambiguous-name';
export const CATEGORY_OVERLOADED_SYMBOL = 'overloaded-symbol';
export const CATEGORY_MAGIC_LITERAL = 'magic-literal';
export const CATEGORY_REDUNDANT_TYPE_CONSTANT = 'redundant-type-constant';
export const CATEGORY_BOOLEAN_TRAP = 'boolean-trap';
export const CATEGORY_DEEP_CALLBACK = 'deep-callback';

export const IGNORE_EXPORTS = ['default', 'anonymous'];

export const MSG_EXTREME_FILE = (lineCount: number) =>
  `Extreme file length (${lineCount} lines) — AI context window will overflow or "Lose the Middle" critical details.`;

export const MSG_LARGE_FILE = (lineCount: number) =>
  `Large file (${lineCount} lines) — pushing the limits of effective AI reasoning.`;

export const SUGGESTION_SPLIT_FILE =
  'Split into smaller, single-responsibility modules (< 500 lines).';
export const SUGGESTION_REFACTOR_FILE =
  'Consider refactoring and extracting logic to new files.';
