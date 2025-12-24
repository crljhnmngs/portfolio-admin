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
            prefix: 'projects-get',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const { searchParams } = new URL(req.url);
        const languageCode = searchParams.get('languageCode') || 'en';

        const projects = await prisma.portfolio_projects.findMany({
            where: {
                language_code: languageCode,
            },
            include: {
                portfolio_project_tech: {
                    include: {
                        tech: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        const transformedProjects = projects.map((project) => ({
            id: project.id,
            name: project.name,
            image_url: project.image_url,
            about: project.about,
            date: project.date,
            new: project.new,
            dev: project.dev,
            links: {
                github: project.github,
                live: project.live,
            },
            tech: project.portfolio_project_tech.map((pt) => pt.tech.name),
            language_code: project.language_code,
            created_at: project.created_at,
        }));

        const response = NextResponse.json({ projects: transformedProjects });

        // Add CORS headers
        if (auth.isCrossOrigin && auth.origin) {
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
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
};

export const OPTIONS = handleCorsOptions;
