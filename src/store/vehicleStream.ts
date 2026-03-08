import type { Vehicle } from '../types';

const THROTTLE_MS = 200;

type Listener = () => void;

let vehicles: Vehicle[] = [];
let version = 0;
const listeners = new Set<Listener>();
let timer: ReturnType<typeof setTimeout> | null = null;

function notify() {
  version++;
  listeners.forEach((listener) => listener());
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

export function subscribeStream(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getStreamSnapshot(): number {
  return version;
}
