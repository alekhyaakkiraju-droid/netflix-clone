import { describe, expect, it } from 'vitest';
import { mapPlanformCardToPlan } from './PaymentGateway.jsx';

describe('mapPlanformCardToPlan', () => {
  it('maps Planform titles to API enums', () => {
    expect(mapPlanformCardToPlan('Premium')).toBe('PREMIUM');
    expect(mapPlanformCardToPlan('Standerd')).toBe('STANDARD');
    expect(mapPlanformCardToPlan('Basic')).toBe('STANDARD_WITH_ADS');
    expect(mapPlanformCardToPlan('Mobile')).toBe('MOBILE');
  });

  it('returns undefined for unknown cards', () => {
    expect(mapPlanformCardToPlan('Unknown')).toBeUndefined();
  });
});
