import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/auth-helpers';
import { handleCorsOptions } from '@/lib/cors-helpers';

export const GET = async (req: Request) => {
    try {
        const auth = validateApiKey(req);
        if (!auth.valid) return auth.response;

        const { searchParams } = new URL(req.url);
        const languageCode = searchParams.get('languageCode') || '';

        if (!languageCode) {
            return NextResponse.json(
                { error: 'Missing languageCode' },
                { status: 400 }
            );
        }

        const roles = await prisma.translated_roles.findMany({
            where: {
                language_code: languageCode,
            },
            select: {
                id: true,
                general_info_id: true,
                language_code: true,
                role_name: true,
            },
            orderBy: { created_at: 'asc' },
        });

        const response = NextResponse.json({
            roles,
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
        console.error('Error fetching translated roles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch translated roles' },
            { status: 500 }
        );
    }
};

export const OPTIONS = handleCorsOptions;
