import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isSiteMaintenance = process.env.SITE_MAINTENANCE === 'true';
  const isSitePaused = process.env.SITE_PAUSED === 'true';
  const { pathname } = request.nextUrl.clone();

  if (isSiteMaintenance || isSitePaused) {
    // Block API access
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        {
          error: `Service is ${isSiteMaintenance ? 'under maintenance' : 'paused'}`,
        },
        { status: 503 },
      );
    }

    // Block direct access to the exported Godot game
    if (pathname.startsWith('/velocity-rush')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/velocity-rush/:path*'],
};
