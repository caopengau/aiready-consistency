import { calculateImportSimilarity } from '@aiready/core';
import type { ExportInfo } from './types';

/**
 * Calculate cohesion score (how related are exports in a file)
 */
export function calculateEnhancedCohesion(
  exports: ExportInfo[],
  filePath?: string,
  options?: {
    coUsageMatrix?: Map<string, Map<string, number>>;
    weights?: {
      importBased?: number;
      structural?: number;
      domainBased?: number;
    };
  }
): number {
  if (exports.length <= 1) return 1;

  const weights = {
    importBased: options?.weights?.importBased ?? 0.4,
    structural: options?.weights?.structural ?? 0.3,
    domainBased: options?.weights?.domainBased ?? 0.3,
  };

  // 1. Domain-based cohesion (are they in the same domain?)
  const domains = exports.map((e) => e.inferredDomain || 'unknown');
  const uniqueDomains = new Set(domains.filter((d) => d !== 'unknown'));
  const domainScore = uniqueDomains.size <= 1 ? 1 : 1 / uniqueDomains.size;

  // 2. Import-based cohesion (do they share similar imports?)
  let importScore = 0;
  let pairs = 0;
  for (let i = 0; i < exports.length; i++) {
    for (let j = i + 1; j < exports.length; j++) {
      const sim = calculateImportSimilarity(
        exports[i].imports || [],
        exports[j].imports || []
      );
      importScore += sim;
      pairs++;
    }
  }
  const avgImportScore = pairs > 0 ? importScore / pairs : 1;

  // 3. Structural cohesion (do they depend on each other?)
  let structuralScore = 0;
  for (const exp of exports) {
    if (exp.dependencies && exp.dependencies.length > 0) {
      structuralScore += 1;
    }
  }
  const avgStructuralScore =
    exports.length > 0 ? structuralScore / exports.length : 0;

  // Weighted average
  return (
    domainScore * weights.domainBased +
    avgImportScore * weights.importBased +
    Math.min(1, avgStructuralScore * 2) * weights.structural
  );
}

/**
 * Calculate fragmentation score (how scattered is a domain)
 */
export function calculateFragmentation(
  files: string[],
  domain: string,
  options?: { useLogScale?: boolean; logBase?: number }
): number {
  if (files.length <= 1) return 0;

  const directories = new Set(
    files.map((f) => f.split('/').slice(0, -1).join('/'))
  );
  const uniqueDirs = directories.size;

  if (options?.useLogScale) {
    if (uniqueDirs <= 1) return 0;
    const total = files.length;
    const base = options.logBase || Math.E;
    const num = Math.log(uniqueDirs) / Math.log(base);
    const den = Math.log(total) / Math.log(base);
    return den > 0 ? num / den : 0;
  }

  return (uniqueDirs - 1) / (files.length - 1);
}

/**
 * Calculate path entropy for a set of files
 */
export function calculatePathEntropy(files: string[]): number {
  if (!files || files.length === 0) return 0;

  const dirCounts = new Map<string, number>();
  for (const f of files) {
    const dir = f.split('/').slice(0, -1).join('/') || '.';
    dirCounts.set(dir, (dirCounts.get(dir) || 0) + 1);
  }

  const counts = Array.from(dirCounts.values());
  if (counts.length <= 1) return 0;

  const total = counts.reduce((s, v) => s + v, 0);
  let entropy = 0;
  for (const count of counts) {
    const prob = count / total;
    entropy -= prob * Math.log2(prob);
  }

  const maxEntropy = Math.log2(counts.length);
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
}

/**
 * Calculate directory-distance metric based on common ancestor depth
 */
export function calculateDirectoryDistance(files: string[]): number {
  if (!files || files.length <= 1) return 0;

  const pathSegments = (p: string) => p.split('/').filter(Boolean);
  const commonAncestorDepth = (a: string[], b: string[]) => {
    const minLen = Math.min(a.length, b.length);
    let i = 0;
    while (i < minLen && a[i] === b[i]) i++;
    return i;
  };

  let totalNormalized = 0;
  let comparisons = 0;

  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      const segA = pathSegments(files[i]);
      const segB = pathSegments(files[j]);
      const shared = commonAncestorDepth(segA, segB);
      const maxDepth = Math.max(segA.length, segB.length);
      totalNormalized += 1 - (maxDepth > 0 ? shared / maxDepth : 0);
      comparisons++;
    }
  }

  return comparisons > 0 ? totalNormalized / comparisons : 0;
}
