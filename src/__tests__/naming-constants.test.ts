import { describe, it, expect } from 'vitest';
import {
  snakeCaseToCamelCase,
  detectNamingConventions,
  COMMON_SHORT_WORDS,
  ACCEPTABLE_ABBREVIATIONS,
} from '../analyzers/naming-constants';

describe('snakeCaseToCamelCase', () => {
  it('should convert simple snake_case to camelCase', () => {
    expect(snakeCaseToCamelCase('hello_world')).toBe('helloWorld');
    expect(snakeCaseToCamelCase('foo_bar')).toBe('fooBar');
  });

  it('should handle single word snake_case', () => {
    expect(snakeCaseToCamelCase('hello')).toBe('hello');
  });

  it('should handle multiple underscores', () => {
    expect(snakeCaseToCamelCase('a_b_c_d')).toBe('aBCD');
  });

  it('should handle leading underscores', () => {
    expect(snakeCaseToCamelCase('_private_method')).toBe('privateMethod');
  });

  it('should handle numbers in snake_case', () => {
    expect(snakeCaseToCamelCase('user_id_1')).toBe('userId1');
  });

  it('should handle already camelCase strings', () => {
    expect(snakeCaseToCamelCase('alreadyCamelCase')).toBe('alreadyCamelCase');
  });

  it('should handle uppercase letters after underscore', () => {
    expect(snakeCaseToCamelCase('hello_WORLD')).toBe('helloWORLD');
  });
});

describe('COMMON_SHORT_WORDS', () => {
  it('should include common short English words', () => {
    expect(COMMON_SHORT_WORDS.has('day')).toBe(true);
    expect(COMMON_SHORT_WORDS.has('key')).toBe(true);
    expect(COMMON_SHORT_WORDS.has('net')).toBe(true);
    expect(COMMON_SHORT_WORDS.has('use')).toBe(true);
  });
});

describe('ACCEPTABLE_ABBREVIATIONS', () => {
  it('should include standard identifiers', () => {
    expect(ACCEPTABLE_ABBREVIATIONS.has('id')).toBe(true);
    expect(ACCEPTABLE_ABBREVIATIONS.has('uid')).toBe(true);
    expect(ACCEPTABLE_ABBREVIATIONS.has('pid')).toBe(true);
  });

  it('should include web/network abbreviations', () => {
    expect(ACCEPTABLE_ABBREVIATIONS.has('url')).toBe(true);
    expect(ACCEPTABLE_ABBREVIATIONS.has('api')).toBe(true);
    expect(ACCEPTABLE_ABBREVIATIONS.has('http')).toBe(true);
  });

  it('should include data format abbreviations', () => {
    expect(ACCEPTABLE_ABBREVIATIONS.has('json')).toBe(true);
    expect(ACCEPTABLE_ABBREVIATIONS.has('xml')).toBe(true);
    expect(ACCEPTABLE_ABBREVIATIONS.has('yaml')).toBe(true);
  });

  it('should include boolean helpers', () => {
    expect(ACCEPTABLE_ABBREVIATIONS.has('is')).toBe(true);
    expect(ACCEPTABLE_ABBREVIATIONS.has('has')).toBe(true);
    expect(ACCEPTABLE_ABBREVIATIONS.has('can')).toBe(true);
  });
});

describe('detectNamingConventions', () => {
  it('should detect camelCase as dominant for TypeScript files', () => {
    const result = detectNamingConventions(
      ['file.ts', 'another.ts'],
      [{ type: 'other-issue' }]
    );
    expect(result.dominantConvention).toBe('camelCase');
    expect(result.conventionScore).toBe(0.9);
  });

  it('should detect mixed conventions when there are many convention issues', () => {
    const manyIssues = Array(40).fill({ type: 'convention-mix' });
    const result = detectNamingConventions(['file.ts'], manyIssues as any);
    expect(result.dominantConvention).toBe('mixed');
    expect(result.conventionScore).toBe(0.5);
  });
});
