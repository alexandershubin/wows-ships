import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const segments = Array.isArray(path) ? path.join('/') : (path ?? '');
  const targetUrl = `https://vortex.worldofwarships.eu/${segments}`;

  try {
    const apiRes = await fetch(targetUrl);
    const contentType = apiRes.headers.get('content-type') ?? 'application/json';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.status(apiRes.status);

    const buffer = Buffer.from(await apiRes.arrayBuffer());
    res.send(buffer);
  } catch {
    res.status(502).json({ error: 'Failed to fetch from upstream API' });
  }
}
