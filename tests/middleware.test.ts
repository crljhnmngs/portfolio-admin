import { middleware } from '@/middleware';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('next/server', () => ({
    NextResponse: {
        redirect: jest.fn((url) => ({ type: 'redirect', url })),
        next: jest.fn(() => ({ type: 'next' })),
    },
}));

const getMockRequest = (pathname: string, token?: string) => ({
    nextUrl: {
        pathname,
        origin: 'http://localhost',
        href: `http://localhost${pathname}`,
    },
    url: `http://localhost${pathname}`,
    cookies: {
        get: jest.fn((key) =>
            key === 'sb-fcxvldxxwkxkxfmlstcs-auth-token' && token
                ? { value: token }
                : undefined
        ),
    },
});

describe('middleware', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to login if accessing protected route without token', () => {
        const req = getMockRequest('/dashboard');
        const res = middleware(req as unknown as NextRequest);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL('/', req.url)
        );
        expect(res.type).toBe('redirect');
    });

    it('should allow access to protected route with token', () => {
        const req = getMockRequest('/dashboard', 'token');
        const res = middleware(req as unknown as NextRequest);
        expect(NextResponse.next).toHaveBeenCalled();
        expect(res.type).toBe('next');
    });

    it('should redirect to dashboard if accessing auth route with token', () => {
        const req = getMockRequest('/', 'token');
        const res = middleware(req as unknown as NextRequest);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL('/dashboard', req.url)
        );
        expect(res.type).toBe('redirect');
    });

    it('should allow access to auth route without token', () => {
        const req = getMockRequest('/');
        const res = middleware(req as unknown as NextRequest);
        expect(NextResponse.next).toHaveBeenCalled();
        expect(res.type).toBe('next');
    });
});
