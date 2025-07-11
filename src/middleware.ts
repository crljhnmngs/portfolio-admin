import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/'];

export const middleware = (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get(
        'sb-fcxvldxxwkxkxfmlstcs-auth-token'
    )?.value;

    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!token) {
            const loginUrl = new URL('/', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    if (authRoutes.some((route) => pathname === route)) {
        if (token) {
            const dashboardUrl = new URL('/dashboard', request.url);
            return NextResponse.redirect(dashboardUrl);
        }
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/', '/dashboard/:path*'],
};
