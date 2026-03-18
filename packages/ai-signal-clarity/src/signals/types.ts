import { Severity, IssueType } from '@aiready/core';
import type { AiSignalClarityIssue, AiSignalClarityOptions } from '../types';

export interface SignalContext {
  filePath: string;
  code: string;
  lineCount: number;
  options: AiSignalClarityOptions;
}

export interface SignalResult {
  issues: AiSignalClarityIssue[];
  signals: Record<string, number>;
}

export { Severity, IssueType };
