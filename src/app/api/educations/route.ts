import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handleCorsOptions } from '@/lib/cors-helpers';
import { validateApiKey } from '@/lib/auth-helpers';

export const GET = async (req: Request) => {
    try {
        const auth = validateApiKey(req);
        if (!auth.valid) return auth.response;

        const { searchParams } = new URL(req.url);
        const languageCode = searchParams.get('languageCode') || '';

        const educations = await prisma.educations.findMany({
            where: languageCode ? { language_code: languageCode } : {},
            include: {
                education_tech: {
                    include: { tech: true },
                },
            },
            orderBy: {
                start_date: 'desc',
            },
        });

        // Transform data to flatten tech arrays
        const transformedEducations = educations.map((edu) => ({
            ...edu,
            tech: edu.education_tech.map((et) => et.tech.name),
            education_tech: undefined,
        }));

        const response = NextResponse.json({
            educations: transformedEducations,
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
        console.error('Error fetching educations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch educations' },
            { status: 500 }
        );
    }
};

export const OPTIONS = handleCorsOptions;
