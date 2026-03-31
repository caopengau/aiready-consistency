import { describe, it, expect } from 'vitest';
import { NAMING_CONSISTENCY_PROVIDER } from '../provider';

describe('Consistency Provider', () => {
  it('should have correct ID', () => {
    expect(NAMING_CONSISTENCY_PROVIDER.id).toBe('naming-consistency');
  });

  it('should have alias', () => {
    expect(NAMING_CONSISTENCY_PROVIDER.alias).toContain('consistency');
  });
});
