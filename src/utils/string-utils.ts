/**
 * Simple singularization for common English plurals.
 * Shared across graph-builder and semantic-analysis.
 */
export function singularize(word: string): string {
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
