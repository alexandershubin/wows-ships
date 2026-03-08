import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchVehicles } from '../api';

function makeReadableStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      if (i < chunks.length) {
        controller.enqueue(encoder.encode(chunks[i++]));
      } else {
        controller.close();
      }
    },
  });
}

function mockFetch(body: string, chunks?: string[]) {
  const stream = chunks
    ? makeReadableStream(chunks)
    : makeReadableStream([body]);

  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    headers: new Headers({ 'Content-Length': String(new TextEncoder().encode(body).length) }),
    body: stream,
  }));
}

afterEach(() => {
  vi.restoreAllMocks();
});

const sampleResponse = JSON.stringify({
  status: 'ok',
  data: {
    '123': {
      level: 10,
      name: 'Yamato',
      nation: 'japan',
      icons: {},
      tags: ['Battleship'],
      localization: { shortmark: { en: 'Yamato' }, description: {} },
    },
    '456': {
      level: 9,
      name: 'Iowa',
      nation: 'usa',
      icons: {},
      tags: ['Battleship'],
      localization: { shortmark: { en: 'Iowa' }, description: {} },
    },
  },
});

describe('fetchVehicles', () => {
  it('parses complete response into vehicles', async () => {
    mockFetch(sampleResponse);

    const result = await fetchVehicles();
    expect(Object.keys(result)).toHaveLength(2);
    expect(result['123'].id).toBe('123');
    expect(result['123'].name).toBe('Yamato');
    expect(result['456'].id).toBe('456');
  });

  it('calls onProgress with progress values', async () => {
    mockFetch(sampleResponse);
    const onProgress = vi.fn();

    await fetchVehicles(onProgress);
    expect(onProgress).toHaveBeenCalled();
    // last call should be close to 1
    const lastCall = onProgress.mock.calls[onProgress.mock.calls.length - 1][0];
    expect(lastCall).toBeCloseTo(1, 0);
  });

  it('streams entries via onEntries callback', async () => {
    mockFetch(sampleResponse, [sampleResponse]);
    const onEntries = vi.fn();

    await fetchVehicles(undefined, onEntries);
    expect(onEntries).toHaveBeenCalled();

    const allEntries = onEntries.mock.calls.flatMap((call: unknown[]) => call[0]);
    expect(allEntries).toHaveLength(2);
    expect(allEntries[0].id).toBe('123');
    expect(allEntries[1].id).toBe('456');
  });

  it('handles chunked streaming across entry boundaries', async () => {
    // Split the response mid-entry to test the parser handles partial data
    const mid = Math.floor(sampleResponse.length / 2);
    const chunk1 = sampleResponse.slice(0, mid);
    const chunk2 = sampleResponse.slice(mid);
    mockFetch(sampleResponse, [chunk1, chunk2]);
    const onEntries = vi.fn();

    const result = await fetchVehicles(undefined, onEntries);
    expect(Object.keys(result)).toHaveLength(2);

    const allStreamed = onEntries.mock.calls.flatMap((call: unknown[]) => call[0]);
    expect(allStreamed.length).toBeGreaterThanOrEqual(1);
  });

  it('throws on non-ok HTTP response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    }));

    await expect(fetchVehicles()).rejects.toThrow('HTTP 500');
  });

  it('throws on error API status', async () => {
    const errorResponse = JSON.stringify({ status: 'error', data: {} });
    mockFetch(errorResponse);

    await expect(fetchVehicles()).rejects.toThrow('API returned error status');
  });

  it('throws when body is null', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      body: null,
    }));

    await expect(fetchVehicles()).rejects.toThrow('Response body is null');
  });

  it('handles entries with escaped strings in values', async () => {
    const response = JSON.stringify({
      status: 'ok',
      data: {
        '789': {
          level: 5,
          name: 'Test "Ship"',
          nation: 'uk',
          icons: {},
          tags: ['Cruiser'],
          localization: { shortmark: { en: 'Test \\"Ship\\"' }, description: {} },
        },
      },
    });
    mockFetch(response);

    const result = await fetchVehicles();
    expect(Object.keys(result)).toHaveLength(1);
    expect(result['789'].id).toBe('789');
  });
});
