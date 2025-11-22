import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/auth-helpers';
import { handleCorsOptions } from '@/lib/cors-helpers';

export const GET = async (req: Request) => {
    try {
        const auth = validateApiKey(req);
        if (!auth.valid) return auth.response;

        const languages = await prisma.supported_languages.findMany({
            select: {
                code: true,
                name: true,
                is_default: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        const response = NextResponse.json({
            supportedLanguages: languages,
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
        console.error('Error fetching supported languages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch supported languages' },
            { status: 500 }
        );
    }
};

export const OPTIONS = handleCorsOptions;
