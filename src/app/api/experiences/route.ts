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
            prefix: 'experiences-get',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const { searchParams } = new URL(req.url);
        const languageCode = searchParams.get('languageCode') || '';

        if (!languageCode) {
            return NextResponse.json(
                { error: 'Missing languageCode' },
                { status: 400 }
            );
        }

        const where = languageCode ? { language_code: languageCode } : {};

        const experiences = await prisma.experiences.findMany({
            where,
            select: {
                id: true,
                logo: true,
                company: true,
                role: true,
                description: true,
                link: true,
                start_date: true,
                end_date: true,
                language_code: true,
                created_at: true,

                // Include tech stack
                experience_tech: {
                    select: {
                        tech: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },

                // Include sub_items with projects
                sub_items: {
                    select: {
                        id: true,
                        position: true,
                        setup: true,
                        start_date: true,
                        end_date: true,

                        // Include projects with their tech
                        projects: {
                            select: {
                                id: true,
                                description: true,
                                created_at: true,

                                // Include project tech
                                project_tech: {
                                    select: {
                                        tech: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                            orderBy: {
                                created_at: 'desc',
                            },
                        },
                    },
                    orderBy: {
                        start_date: 'desc',
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        // Transform data to flatten tech arrays
        const transformedExperiences = experiences.map((exp) => ({
            ...exp,
            tech: exp.experience_tech.map((et) => et.tech.name),
            sub_items: exp.sub_items.map((subItem) => ({
                ...subItem,
                projects: subItem.projects.map((project) => ({
                    ...project,
                    tech: project.project_tech.map((pt) => pt.tech.name),
                    project_tech: undefined,
                })),
            })),
            experience_tech: undefined,
        }));

        const response = NextResponse.json({
            experiences: transformedExperiences,
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
        console.error('Error fetching experiences:', error);
        return NextResponse.json(
            { error: 'Failed to fetch experiences' },
            { status: 500 }
        );
    }
};

export const OPTIONS = handleCorsOptions;
