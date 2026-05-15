import { describe, it, expect } from 'vitest';
import { gradientForTitle } from './videoPlaceholder';

describe('gradientForTitle', () => {
  it('returns a linear-gradient string', () => {
    const g = gradientForTitle('Barbie');
    expect(g).toMatch(/^linear-gradient\(/);
  });

  it('is stable for the same title', () => {
    expect(gradientForTitle('Oppenheimer')).toBe(gradientForTitle('Oppenheimer'));
  });

  it('differs for different titles (usually)', () => {
    const a = gradientForTitle('A');
    const b = gradientForTitle('B');
    expect(a).not.toBe(b);
  });
});
