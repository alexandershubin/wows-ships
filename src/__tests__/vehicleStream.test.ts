import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  addStreamEntries,
  flushStream,
  resetStream,
  getStreamVehicles,
  subscribeStream,
  getStreamSnapshot,
} from '../store/vehicleStream';
import type { Vehicle } from '../types';

function makeVehicle(id: string): Vehicle {
  return {
    id,
    level: 5,
    name: id,
    nation: 'japan',
    icons: {} as Vehicle['icons'],
    tags: ['Destroyer'],
    localization: { shortmark: { en: id }, description: {} },
  };
}

afterEach(() => {
  resetStream();
});

describe('vehicleStream', () => {
  it('starts with empty vehicles', () => {
    expect(getStreamVehicles()).toHaveLength(0);
  });

  it('addStreamEntries appends vehicles', () => {
    addStreamEntries([makeVehicle('A'), makeVehicle('B')]);
    expect(getStreamVehicles()).toHaveLength(2);
    expect(getStreamVehicles()[0].id).toBe('A');
  });

  it('resetStream clears vehicles', () => {
    addStreamEntries([makeVehicle('A')]);
    resetStream();
    expect(getStreamVehicles()).toHaveLength(0);
  });

  it('flushStream increments version and notifies listeners', () => {
    const listener = vi.fn();
    const unsub = subscribeStream(listener);

    const before = getStreamSnapshot();
    flushStream();
    const after = getStreamSnapshot();

    expect(after).toBe(before + 1);
    expect(listener).toHaveBeenCalledTimes(1);
    unsub();
  });

  it('addStreamEntries throttles notifications', () => {
    vi.useFakeTimers();
    const listener = vi.fn();
    const unsub = subscribeStream(listener);

    addStreamEntries([makeVehicle('A')]);
    addStreamEntries([makeVehicle('B')]);
    addStreamEntries([makeVehicle('C')]);

    // not yet notified — timer pending
    expect(listener).not.toHaveBeenCalled();
    expect(getStreamVehicles()).toHaveLength(3);

    vi.advanceTimersByTime(200);
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
    vi.useRealTimers();
  });

  it('flushStream clears pending throttle timer', () => {
    vi.useFakeTimers();
    const listener = vi.fn();
    const unsub = subscribeStream(listener);

    addStreamEntries([makeVehicle('A')]);
    flushStream(); // should notify immediately and cancel timer

    expect(listener).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(200);
    // no extra notification from old timer
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
    vi.useRealTimers();
  });

  it('resetStream cancels pending timer', () => {
    vi.useFakeTimers();
    const listener = vi.fn();
    const unsub = subscribeStream(listener);

    addStreamEntries([makeVehicle('A')]);
    resetStream();

    vi.advanceTimersByTime(200);
    expect(listener).not.toHaveBeenCalled();

    unsub();
    vi.useRealTimers();
  });

  it('unsubscribe removes listener', () => {
    const listener = vi.fn();
    const unsub = subscribeStream(listener);
    unsub();

    flushStream();
    expect(listener).not.toHaveBeenCalled();
  });

  it('version increments on each notification', () => {
    const v1 = getStreamSnapshot();
    flushStream();
    const v2 = getStreamSnapshot();
    flushStream();
    const v3 = getStreamSnapshot();

    expect(v2).toBe(v1 + 1);
    expect(v3).toBe(v2 + 1);
  });
});
