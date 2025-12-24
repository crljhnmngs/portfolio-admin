import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GeneralInfoResponse } from '@/types/global';
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
            prefix: 'general-info-get',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const data = await prisma.general_info.findFirst({
            select: {
                id: true,
                email: true,
                resume_url: true,
                schedule_link: true,
                social_profiles: {
                    select: {
                        platform: true,
                        url: true,
                    },
                },
            },
        });

        if (!data) {
            return NextResponse.json(
                { error: 'No data found' },
                { status: 404 }
            );
        }

        const socialLinks = data.social_profiles.reduce<Record<string, string>>(
            (acc, profile) => {
                acc[profile.platform.toLowerCase()] = profile.url;
                return acc;
            },
            {}
        );

        const generalInfo: GeneralInfoResponse = {
            id: data.id,
            email: data.email,
            resumeUrl: data.resume_url,
            scheduleLink: data.schedule_link,
            socialLinks,
        };

        const response = NextResponse.json({ generalInfo });

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
        console.error('Error fetching general_info:', error);
        return NextResponse.json(
            { error: 'Failed to fetch general info' },
            { status: 500 }
        );
    }
};

export const OPTIONS = handleCorsOptions;
