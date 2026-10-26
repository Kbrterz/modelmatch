import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

export function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  let record = ipRequestCounts.get(ip);
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
    record = { count: 1, timestamp: now };
    ipRequestCounts.set(ip, record);
  } else {
    record.count++;
    if (record.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/recommend',
};
