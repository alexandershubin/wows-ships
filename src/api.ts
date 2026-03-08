import type { Nation, Vehicle, VehicleType } from './types';

const BASE = '/wows-api/api/encyclopedia/en';

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const json = await res.json();
  if (json.status !== 'ok') throw new Error('API returned error status');
  return json.data as T;
}

interface RawVehicle {
  level: number;
  name: string;
  nation: string;
  icons: Vehicle['icons'];
  tags: string[];
  localization: Vehicle['localization'];
}

function extractEntries(buf: string): { entries: [string, string][]; rest: string } {
  const entries: [string, string][] = [];
  let i = 0;

  while (i < buf.length) {
    while (i < buf.length && (buf[i] === ',' || buf[i] === '\n' || buf[i] === '\r' || buf[i] === '\t' || buf[i] === ' ')) {
      i++;
    }

    if (i >= buf.length) break;

    if (buf[i] === '}') break;

    if (buf[i] !== '"') break;

    const keyStart = i + 1;
    const keyEnd = buf.indexOf('"', keyStart);
    if (keyEnd === -1) break; // incomplete key, need more data

    const key = buf.slice(keyStart, keyEnd);

    const braceIdx = buf.indexOf('{', keyEnd + 1);
    if (braceIdx === -1) break; // incomplete, need more data

    let depth = 0;
    let inStr = false;
    let escaped = false;
    let end = -1;

    for (let j = braceIdx; j < buf.length; j++) {
      const ch = buf[j];
      if (escaped) { escaped = false; continue; }
      if (ch === '\\' && inStr) { escaped = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === '{') depth++;
      if (ch === '}') {
        depth--;
        if (depth === 0) { end = j; break; }
      }
    }

    if (end === -1) break;

    entries.push([key, buf.slice(braceIdx, end + 1)]);
    i = end + 1;
  }

  return { entries, rest: buf.slice(i) };
}

export async function fetchMeta() {
  const [nations, vehicleTypes, mediaPath] = await Promise.all([
    apiFetch<Nation[]>(`${BASE}/nations/`),
    apiFetch<Record<string, VehicleType>>(`${BASE}/vehicle_types_common/`),
    apiFetch<string>(`${BASE}/media_path/`),
  ]);
  return { nations, vehicleTypes, mediaPath };
}

export async function fetchVehicles(
  onProgress?: (progress: number) => void,
  onEntries?: (entries: Vehicle[]) => void,
): Promise<Record<string, Vehicle>> {
  const res = await fetch(`${BASE}/vehicles/`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const contentLength = Number(res.headers.get('Content-Length') ?? 0);
  if (!res.body) throw new Error('Response body is null');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const chunks: Uint8Array<ArrayBuffer>[] = [];

  let buf = '';
  let received = 0;
  let pastDataKey = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value as Uint8Array<ArrayBuffer>);
    received += value.length;
    if (contentLength > 0) onProgress?.(received / contentLength);

    if (onEntries) {
      buf += decoder.decode(value, { stream: true });

      if (!pastDataKey) {
        const match = buf.match(/"data"\s*:\s*\{/);
        if (match) {
          buf = buf.slice(match.index! + match[0].length);
          pastDataKey = true;
        }
      }

      if (pastDataKey) {
        const { entries, rest } = extractEntries(buf);
        buf = rest;

        if (entries.length > 0) {
          const batch: Vehicle[] = [];
          for (const [id, rawJson] of entries) {
            const v: RawVehicle = JSON.parse(rawJson);
            batch.push({ ...v, id });
          }
          onEntries(batch);
        }
      }
    }
  }

  const text = await new Blob(chunks).text();
  const json: { status: string; data: Record<string, RawVehicle> } = JSON.parse(text);
  if (json.status !== 'ok') throw new Error('API returned error status');

  const vehicles: Record<string, Vehicle> = {};
  for (const [id, v] of Object.entries(json.data)) {
    vehicles[id] = { ...v, id };
  }
  return vehicles;
}
