import { describe, it, expect } from 'vitest';
import { escapePostgrestSearch } from '../utils';

describe('escapePostgrestSearch', () => {
  it('escapes commas that would break PostgREST filter syntax', () => {
    expect(escapePostgrestSearch('senior, staff')).toBe('senior\\, staff');
  });

  it('escapes percent signs (SQL wildcards)', () => {
    expect(escapePostgrestSearch('100%')).toBe('100\\%');
  });

  it('escapes underscores (SQL single-char wildcards)', () => {
    expect(escapePostgrestSearch('test_case')).toBe('test\\_case');
  });

  it('escapes backslashes', () => {
    expect(escapePostgrestSearch('path\\to')).toBe('path\\\\to');
  });

  it('handles multiple special characters', () => {
    expect(escapePostgrestSearch('a,b%c_d\\e')).toBe('a\\,b\\%c\\_d\\\\e');
  });

  it('leaves normal text unchanged', () => {
    expect(escapePostgrestSearch('software engineer')).toBe('software engineer');
  });

  it('handles empty string', () => {
    expect(escapePostgrestSearch('')).toBe('');
  });
});
