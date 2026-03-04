import { estimateTokens } from '@aiready/core';
import type { DependencyGraph, DependencyNode } from './types';
import {
  buildCoUsageMatrix,
  buildTypeGraph,
  inferDomainFromSemantics,
} from './semantic-analysis';
import { extractExportsWithAST } from './ast-utils';

interface FileContent {
  file: string;
  content: string;
}

/**
 * Auto-detect domain keywords from workspace folder structure
 */
export function extractDomainKeywordsFromPaths(files: FileContent[]): string[] {
  const folderNames = new Set<string>();

  for (const { file } of files) {
    const segments = file.split('/');
    const skipFolders = new Set([
      'src',
      'lib',
      'dist',
      'build',
      'node_modules',
      'test',
      'tests',
      '__tests__',
      'spec',
      'e2e',
      'scripts',
      'components',
      'utils',
      'helpers',
      'util',
      'helper',
      'api',
      'apis',
    ]);

    for (const segment of segments) {
      const normalized = segment.toLowerCase();
      if (
        normalized &&
        !skipFolders.has(normalized) &&
        !normalized.includes('.')
      ) {
        folderNames.add(singularize(normalized));
      }
    }
  }

  return Array.from(folderNames);
}

/**
 * Simple singularization for common English plurals
 */
function singularize(word: string): string {
  const irregulars: Record<string, string> = {
    people: 'person',
    children: 'child',
    men: 'man',
    women: 'woman',
  };

  if (irregulars[word]) return irregulars[word];
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('ses')) return word.slice(0, -2);
  if (word.endsWith('s') && word.length > 3) return word.slice(0, -1);

  return word;
}

/**
 * Build a dependency graph from file contents
 */
export function buildDependencyGraph(
  files: FileContent[],
  options?: { domainKeywords?: string[] }
): DependencyGraph {
  const nodes = new Map<string, DependencyNode>();
  const edges = new Map<string, Set<string>>();

  const autoDetectedKeywords =
    options?.domainKeywords ?? extractDomainKeywordsFromPaths(files);

  for (const { file, content } of files) {
    const imports = extractImportsFromContent(content);
    const exports = extractExportsWithAST(
      content,
      file,
      { domainKeywords: autoDetectedKeywords },
      imports
    );

    const tokenCost = estimateTokens(content);
    const linesOfCode = content.split('\n').length;

    nodes.set(file, { file, imports, exports, tokenCost, linesOfCode });
    edges.set(file, new Set(imports));
  }

  const graph: DependencyGraph = { nodes, edges };
  const coUsageMatrix = buildCoUsageMatrix(graph);
  const typeGraph = buildTypeGraph(graph);

  graph.coUsageMatrix = coUsageMatrix;
  graph.typeGraph = typeGraph;

  for (const [file, node] of nodes) {
    for (const exp of node.exports) {
      const semanticAssignments = inferDomainFromSemantics(
        file,
        exp.name,
        graph,
        coUsageMatrix,
        typeGraph,
        exp.typeReferences
      );
      exp.domains = semanticAssignments;
      if (semanticAssignments.length > 0) {
        exp.inferredDomain = semanticAssignments[0].domain;
      }
    }
  }

  return graph;
}

/**
 * Extract imports from file content using regex
 */
export function extractImportsFromContent(content: string): string[] {
  const imports: string[] = [];
  const patterns = [
    /import\s+.*?\s+from\s+['"](.+?)['"]/g,
    /import\s+['"](.+?)['"]/g,
    /require\(['"](.+?)['"]\)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath && !importPath.startsWith('node:')) {
        imports.push(importPath);
      }
    }
  }

  return [...new Set(imports)];
}

/**
 * Calculate the maximum depth of import tree for a file
 */
export function calculateImportDepth(
  file: string,
  graph: DependencyGraph,
  visited = new Set<string>(),
  depth = 0
): number {
  if (visited.has(file)) return depth;

  const dependencies = graph.edges.get(file);
  if (!dependencies || dependencies.size === 0) return depth;

  visited.add(file);
  let maxDepth = depth;

  for (const dep of dependencies) {
    maxDepth = Math.max(
      maxDepth,
      calculateImportDepth(dep, graph, visited, depth + 1)
    );
  }

  visited.delete(file);
  return maxDepth;
}

/**
 * Get all transitive dependencies for a file
 */
export function getTransitiveDependencies(
  file: string,
  graph: DependencyGraph,
  visited = new Set<string>()
): string[] {
  if (visited.has(file)) return [];

  visited.add(file);
  const dependencies = graph.edges.get(file);
  if (!dependencies || dependencies.size === 0) return [];

  const allDeps: string[] = [];
  for (const dep of dependencies) {
    allDeps.push(dep);
    allDeps.push(...getTransitiveDependencies(dep, graph, visited));
  }

  return [...new Set(allDeps)];
}

/**
 * Calculate total context budget (tokens needed to understand this file)
 */
export function calculateContextBudget(
  file: string,
  graph: DependencyGraph
): number {
  const node = graph.nodes.get(file);
  if (!node) return 0;

  let totalTokens = node.tokenCost;
  const deps = getTransitiveDependencies(file, graph);

  for (const dep of deps) {
    const depNode = graph.nodes.get(dep);
    if (depNode) {
      totalTokens += depNode.tokenCost;
    }
  }

  return totalTokens;
}

/**
 * Detect circular dependencies
 */
export function detectCircularDependencies(graph: DependencyGraph): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(file: string, path: string[]): void {
    if (recursionStack.has(file)) {
      const cycleStart = path.indexOf(file);
      if (cycleStart !== -1) {
        cycles.push([...path.slice(cycleStart), file]);
      }
      return;
    }

    if (visited.has(file)) return;

    visited.add(file);
    recursionStack.add(file);
    path.push(file);

    const dependencies = graph.edges.get(file);
    if (dependencies) {
      for (const dep of dependencies) {
        dfs(dep, [...path]);
      }
    }

    recursionStack.delete(file);
  }

  for (const file of graph.nodes.keys()) {
    if (!visited.has(file)) {
      dfs(file, []);
    }
  }

  return cycles;
}
