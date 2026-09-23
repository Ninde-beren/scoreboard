import { describe, expect, it } from 'vitest';

import { poolName } from '../lib/poolName';

import { TEAM_COLORS } from './teamColor';

describe('TEAM_COLORS', () => {
  it('holds 33 colors', () => {
    expect(TEAM_COLORS).toHaveLength(33);
  });

  // The color is stored on the team as an index into this list, so two entries
  // sharing a code would make two teams indistinguishable on the TV display.
  it('has no duplicate color code', () => {
    const codes = TEAM_COLORS.map((color) => color.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('has no duplicate name, since the picker shows names', () => {
    const names = TEAM_COLORS.map((color) => color.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('uses uppercase 6-digit hex codes usable straight as CSS', () => {
    for (const { code } of TEAM_COLORS) {
      expect(code).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it('gives every color a non-empty name', () => {
    for (const { name } of TEAM_COLORS) {
      expect(name.trim()).not.toBe('');
    }
  });
});

describe('poolName', () => {
  it('holds 34 labels', () => {
    expect(poolName).toHaveLength(34);
  });

  // Pools are labelled by index; a duplicate would produce two "Pool C".
  it('has no duplicate label', () => {
    expect(new Set(poolName).size).toBe(poolName.length);
  });

  it('starts at A and runs through the alphabet before doubling letters', () => {
    expect(poolName.slice(0, 26)).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    expect(poolName[26]).toBe('AA');
    expect(poolName.at(-1)).toBe('AH');
  });

  it('only uses uppercase letters', () => {
    for (const label of poolName) {
      expect(label).toMatch(/^[A-Z]{1,2}$/);
    }
  });
});
