import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Leemos la cookie llamada 'auth-token'
  const token = request.cookies.get('auth-token')?.value;

  // Rutas que queremos proteger
  const isDashboard = request.nextUrl.pathname.startsWith('/');
  const isLoginPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/';

  // CASO 1: Intenta entrar al Dashboard SIN token
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // CASO 2: Intenta entrar al Login CON token (Ya está logueado)
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configuración: A qué rutas afecta
export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};