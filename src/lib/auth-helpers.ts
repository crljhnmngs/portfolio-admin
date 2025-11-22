import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function validateSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
        return {
            valid: false,
            response: NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            ),
        };
    }

    const { session, user } = await lucia.validateSession(sessionId);

    if (!session || !user) {
        return {
            valid: false,
            response: NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            ),
        };
    }

    return { valid: true, session, user };
}

export function validateApiKey(req: Request) {
    const origin = req.headers.get('origin');
    const apiKey = req.headers.get('x-api-key');
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

    // Same-origin request (admin app)
    if (!origin) {
        return {
            valid: true,
            origin: undefined,
            isCrossOrigin: false,
        };
    }

    if (!allowedOrigins.includes(origin)) {
        return {
            valid: false,
            response: NextResponse.json(
                { error: 'Forbidden - Invalid Origin' },
                { status: 403 }
            ),
        };
    }

    if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
        return {
            valid: false,
            response: NextResponse.json(
                { error: 'Unauthorized - Invalid API Key' },
                { status: 401 }
            ),
        };
    }

    return {
        valid: true,
        origin,
        isCrossOrigin: true,
    };
}
