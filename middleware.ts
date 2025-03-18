import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const isAuthPage = req.nextUrl.pathname.startsWith('/auth/login');
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard/user');

  if (!token && isDashboardPage) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (token && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard/user', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/user/:path*', '/auth/login'],
};
