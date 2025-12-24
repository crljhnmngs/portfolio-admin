import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/auth-helpers';
import { handleCorsOptions } from '@/lib/cors-helpers';
import {
    checkRateLimit,
    createRateLimitResponse,
    getClientIp,
} from '@/lib/rate-limiter';

export const GET = async (req: Request) => {
    try {
        const auth = validateApiKey(req);
        if (!auth.valid) return auth.response;

        const ip = getClientIp(req);
        const rateLimitResult = checkRateLimit(ip, {
            windowMs: 1 * 60 * 1000,
            maxAttempts: 60,
            prefix: 'skills-get',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const skills = await prisma.skills.findMany({
            select: {
                id: true,
                name: true,
                icon_url: true,
                category: true,
                created_at: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        const response = NextResponse.json({
            skills,
        });

        if (auth.origin) {
            response.headers.set('Access-Control-Allow-Origin', auth.origin);
            response.headers.set(
                'Access-Control-Allow-Methods',
                'GET, OPTIONS'
            );
            response.headers.set(
                'Access-Control-Allow-Headers',
                'Content-Type, x-api-key'
            );
        }

        return response;
    } catch (error) {
        console.error('Error fetching skills:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skills' },
            { status: 500 }
        );
    }
};

export const OPTIONS = handleCorsOptions;
