import { add } from './add.js';

// A Request/Response API without a server or external dependencies.
export function handle(request) {
  const url = new URL(request.url);
  if (url.pathname !== '/sum') return Response.json({ error: 'not found' }, { status: 404 });
  const a = url.searchParams.get('a'), b = url.searchParams.get('b');
  if (a === null || b === null || a.trim() === '' || b.trim() === '' || !Number.isFinite(Number(a)) || !Number.isFinite(Number(b))) {
    return Response.json({ error: 'finite a and b required' }, { status: 400 });
  }
  return Response.json({ sum: add(Number(a), Number(b)) });
}
