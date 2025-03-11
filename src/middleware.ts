import { NextResponse } from 'next/server';

export function middleware() {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === 'true';

  if (isMaintenance) {
    return NextResponse.json(
      { error: 'Service is under maintenance' },
      { status: 503 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
