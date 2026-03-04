import type { ContextAnalysisResult } from './types';

/**
 * Calculate overall context score (0-100) based on analysis results
 */
export function calculateContextScore(
  results: ContextAnalysisResult[]
): number {
  if (results.length === 0) return 100;

  const criticalIssues = results.filter(
    (r) => r.severity === 'critical'
  ).length;
  const majorIssues = results.filter((r) => r.severity === 'major').length;

  const penalty = criticalIssues * 15 + majorIssues * 5;
  return Math.max(0, 100 - penalty);
}

/**
 * Map a numerical score to a rating label
 */
export function mapScoreToRating(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  if (score >= 40) return 'needs work';
  return 'critical';
}
