import { describe, it, expect } from 'vitest';
import { normalizeReport } from '../storage';

// Minimal raw report structure as produced by the CLI
function makeRawReport(overrides: Record<string, any> = {}) {
  return {
    rawOutput: {
      scoring: {
        overall: 82,
        rating: 'Good',
        timestamp: '2026-01-01T00:00:00Z',
        breakdown: [
          {
            toolName: 'pattern-detect',
            score: 85,
            criticalIssues: 0,
            majorIssues: 1,
          },
          {
            toolName: 'context-analyzer',
            score: 78,
            criticalIssues: 1,
            majorIssues: 2,
          },
          {
            toolName: 'naming-consistency',
            score: 90,
            criticalIssues: 0,
            majorIssues: 0,
          },
        ],
      },
      summary: {
        totalFiles: 50,
        totalIssues: 8,
        criticalIssues: 1,
        warnings: 7,
      },
      metadata: {
        repository: { name: 'test-repo', branch: 'main', commit: 'abc123' },
      },
      patternDetect: {
        results: [
          {
            fileName: '/tmp/repo-abc/src/utils.ts',
            issues: [
              {
                type: 'duplicate-pattern',
                severity: 'major',
                message: 'Similar to src/helpers.ts',
                location: { file: '/tmp/repo-abc/src/utils.ts', line: 10 },
              },
            ],
          },
        ],
      },
      contextAnalyzer: {
        results: [
          {
            file: '/tmp/repo-abc/src/dashboard.tsx',
            tokenCost: 11000,
            dependencyCount: 5,
            dependencyList: ['react', '@/components/Shell'],
            issues: [
              {
                severity: 'major',
                message: 'Context budget 11,000 exceeds 10,000',
              },
            ],
          },
        ],
        summary: {},
      },
      ...overrides,
    },
  };
}

describe('normalizeReport', () => {
  describe('AI score (repo card)', () => {
    it('extracts overall aiReadinessScore from scoring.overall', () => {
      const result = normalizeReport(makeRawReport());
      expect(result.summary.aiReadinessScore).toBe(82);
    });

    it('returns 0 for aiReadinessScore when scoring is missing', () => {
      const result = normalizeReport({
        rawOutput: { summary: {}, metadata: {} },
      });
      expect(result.summary.aiReadinessScore).toBe(0);
    });

    it('passes totalFiles and issue counts through to summary', () => {
      const result = normalizeReport(makeRawReport());
      expect(result.summary.totalFiles).toBe(50);
      expect(result.summary.criticalIssues).toBe(1);
    });
  });

  describe('breakdown (repo card subscores)', () => {
    it('maps pattern-detect → semanticDuplicates in breakdown', () => {
      const result = normalizeReport(makeRawReport());
      expect(result.breakdown.semanticDuplicates).toBeDefined();
      expect(result.breakdown.semanticDuplicates.score).toBe(85);
    });

    it('maps context-analyzer → contextFragmentation in breakdown', () => {
      const result = normalizeReport(makeRawReport());
      expect(result.breakdown.contextFragmentation).toBeDefined();
      expect(result.breakdown.contextFragmentation.score).toBe(78);
    });

    it('maps naming-consistency → namingConsistency in breakdown', () => {
      const result = normalizeReport(makeRawReport());
      expect(result.breakdown.namingConsistency).toBeDefined();
      expect(result.breakdown.namingConsistency.score).toBe(90);
    });

    it('populates details array from nested issues', () => {
      const result = normalizeReport(makeRawReport());
      const details = result.breakdown.semanticDuplicates?.details ?? [];
      expect(Array.isArray(details)).toBe(true);
      expect(details.length).toBeGreaterThan(0);
      expect(details[0].message).toContain('Similar');
    });

    it('normalizes issue paths using cleanPath (strips /tmp/repo-xxx/)', () => {
      const result = normalizeReport(makeRawReport());
      const details = result.breakdown.semanticDuplicates?.details ?? [];
      const withAbsPath = details.filter((d: any) =>
        d.location?.file?.startsWith('/tmp/')
      );
      expect(withAbsPath).toHaveLength(0);
    });
  });

  describe('rawOutput passthrough', () => {
    it('includes rawOutput in the returned object for graph builder consumption', () => {
      const result = normalizeReport(makeRawReport());
      expect(result.rawOutput).toBeDefined();
      // rawOutput should be the inner rawOutput (source)
      expect((result.rawOutput as any).patternDetect).toBeDefined();
      expect((result.rawOutput as any).contextAnalyzer).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('handles flat breakdown format (legacy CLI output)', () => {
      const legacyReport = {
        breakdown: {
          semanticDuplicates: 85,
          contextFragmentation: 78,
        },
        summary: { totalFiles: 10 },
      };
      const result = normalizeReport(legacyReport);
      // Should still produce a breakdown object even if it's just scores
      expect(result.breakdown).toBeDefined();
    });

    it('does not throw on empty/minimal report', () => {
      expect(() => normalizeReport({})).not.toThrow();
      expect(() => normalizeReport({ rawOutput: {} })).not.toThrow();
    });

    it('passes scoring.timestamp through to metadata.timestamp', () => {
      const ts = '2026-03-06T12:00:00.000Z';
      const result = normalizeReport(
        makeRawReport({
          scoring: { overall: 80, timestamp: ts, breakdown: [] },
        })
      );
      expect(result.metadata.timestamp).toBe(ts);
    });

    it('uses ISO string fallback when scoring.timestamp is absent', () => {
      const result = normalizeReport(
        makeRawReport({
          scoring: { overall: 80, breakdown: [] },
        })
      );
      expect(() => new Date(result.metadata.timestamp)).not.toThrow();
    });
  });
});
