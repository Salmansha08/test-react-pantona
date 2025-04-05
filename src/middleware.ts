import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth/login');
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');
  const isRootPath = req.nextUrl.pathname === '/';

  const hasToken = token && token !== 'undefined' && token !== 'null';

  // Format token sanctum: "id|token"
  const isValidFormat = hasToken && /^\d+\|[A-Za-z0-9]+$/.test(token);

  if ((!hasToken || !isValidFormat) && (isDashboardPage || isRootPath)) {
    const response = NextResponse.redirect(new URL('/auth/login', req.url));
    if (hasToken && !isValidFormat) {
      response.cookies.set('token', '', { expires: new Date(0) });
    }
    return response;
  }

  if (hasToken && isValidFormat && (isAuthPage || isRootPath)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/login'],
};