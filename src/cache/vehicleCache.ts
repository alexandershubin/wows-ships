import type { Vehicle } from '../types';

const DB_NAME = 'wows-ships-cache';
const STORE_NAME = 'keyval';
const KEY = 'vehicles';

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => {
      dbInstance = req.result;
      dbInstance.onclose = () => { dbInstance = null; };
      resolve(dbInstance);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedVehicles(): Promise<Record<string, Vehicle> | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(KEY);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function setCachedVehicles(vehicles: Record<string, Vehicle>): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(vehicles, KEY);
  } catch {
    // cache write failure is non-critical
  }
}
