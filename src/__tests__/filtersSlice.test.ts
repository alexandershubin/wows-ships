import { describe, expect, it } from 'vitest';
import filtersReducer, {
  clearFilters,
  setSearch,
  toggleLevel,
  toggleNation,
  toggleType,
} from '../store/filtersSlice';

const initial = { search: '', nations: [], types: [], levels: [] };

describe('filtersSlice', () => {
  it('returns initial state', () => {
    expect(filtersReducer(undefined, { type: '@@INIT' })).toEqual(initial);
  });

  describe('setSearch', () => {
    it('sets search string', () => {
      const state = filtersReducer(initial, setSearch('Yamato'));
      expect(state.search).toBe('Yamato');
    });
  });

  describe('toggleNation', () => {
    it('adds a nation when not present', () => {
      const state = filtersReducer(initial, toggleNation('japan'));
      expect(state.nations).toContain('japan');
    });

    it('removes a nation when already present', () => {
      const state1 = filtersReducer(initial, toggleNation('japan'));
      const state2 = filtersReducer(state1, toggleNation('japan'));
      expect(state2.nations).not.toContain('japan');
    });

    it('can have multiple nations', () => {
      const s1 = filtersReducer(initial, toggleNation('japan'));
      const s2 = filtersReducer(s1, toggleNation('usa'));
      expect(s2.nations).toEqual(['japan', 'usa']);
    });
  });

  describe('toggleType', () => {
    it('adds a type when not present', () => {
      const state = filtersReducer(initial, toggleType('Destroyer'));
      expect(state.types).toContain('Destroyer');
    });

    it('removes a type when already present', () => {
      const s1 = filtersReducer(initial, toggleType('Cruiser'));
      const s2 = filtersReducer(s1, toggleType('Cruiser'));
      expect(s2.types).not.toContain('Cruiser');
    });
  });

  describe('toggleLevel', () => {
    it('adds a level when not present', () => {
      const state = filtersReducer(initial, toggleLevel(5));
      expect(state.levels).toContain(5);
    });

    it('removes a level when already present', () => {
      const s1 = filtersReducer(initial, toggleLevel(10));
      const s2 = filtersReducer(s1, toggleLevel(10));
      expect(s2.levels).not.toContain(10);
    });
  });

  describe('clearFilters', () => {
    it('resets all filters to initial state', () => {
      const dirty = {
        search: 'Yamato',
        nations: ['japan'],
        types: ['Battleship'],
        levels: [10],
      };
      expect(filtersReducer(dirty, clearFilters())).toEqual(initial);
    });
  });
});
