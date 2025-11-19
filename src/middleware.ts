import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
    '/dashboard',
    '/general-info',
    '/skills',
    '/experience',
    '/education',
];
const authRoutes = ['/'];

export const middleware = (request: NextRequest) => {
    const sessionCookie = request.cookies.get('auth_session')?.value;

    const { pathname } = request.nextUrl;

    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    if (authRoutes.includes(pathname) && sessionCookie) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/general-info',
        '/skills',
        '/experience',
        '/education',
    ],
};
