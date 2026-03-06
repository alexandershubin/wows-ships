import type { Vehicle } from '../types';

/**
 * Lightweight mutable store for vehicles arriving from the stream.
 * Bypasses Redux/Immer entirely — no proxies, no state copies.
 *
 * Vehicles are stored in an array to preserve parse/arrival order,
 * so the grid doesn't reshuffle as new items stream in.
 *
 * Subscribers (via useSyncExternalStore) are notified at most once per
 * THROTTLE_MS, so React re-renders are capped regardless of chunk rate.
 */

const THROTTLE_MS = 200;

type Listener = () => void;

let vehicles: Vehicle[] = [];
let version = 0;
const listeners = new Set<Listener>();
let timer: ReturnType<typeof setTimeout> | null = null;

function notify() {
  version++;
  listeners.forEach((l) => l());
}

export function addStreamEntries(entries: Vehicle[]) {
  for (let i = 0; i < entries.length; i++) {
    vehicles.push(entries[i]);
  }
  if (timer === null) {
    timer = setTimeout(() => {
      timer = null;
      notify();
    }, THROTTLE_MS);
  }
}

/** Force-notify subscribers (e.g. after last chunk before full parse). */
export function flushStream() {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  notify();
}

export function resetStream() {
  vehicles = [];
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

export function getStreamVehicles(): Vehicle[] {
  return vehicles;
}

// --- useSyncExternalStore contract ---

export function subscribeStream(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Returns a version counter — React uses Object.is comparison to detect changes. */
export function getStreamSnapshot(): number {
  return version;
}
