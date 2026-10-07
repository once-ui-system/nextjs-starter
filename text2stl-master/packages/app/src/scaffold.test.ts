// Temporary: proves the Vite/TS/Vitest wiring works end to end. Delete once
// Phase 1 lands the first real, feature-driven test.
import { describe, expect, it } from 'vitest';
import { LitElement } from 'lit';

describe('scaffold', () => {
  it('resolves the lit package', () => {
    expect(LitElement).toBeDefined();
  });
});
