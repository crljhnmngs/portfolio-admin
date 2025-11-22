import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LocalizedInfo } from '@/types/global';
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

        const data = await prisma.general_translations.findFirst({
            where: {
                language_code: languageCode,
            },
            select: {
                id: true,
                general_info_id: true,
                full_name: true,
                current_company: true,
                current_role: true,
                about_me: true,
                address: true,
            },
        });

        if (!data) {
            return NextResponse.json({ localizedInfo: null }, { status: 200 });
        }

        const localizedInfo: LocalizedInfo = {
            id: data.id,
            general_info_id: data.general_info_id,
            full_name: data.full_name,
            current_company: data.current_company,
            current_role: data.current_role,
            about_me: data.about_me,
            address: data.address,
        };

        const response = NextResponse.json({ localizedInfo });

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
        console.error('Error fetching localized_info:', error);
        return NextResponse.json(
            { error: 'Failed to fetch localized info' },
            { status: 500 }
        );
    }
};

export const OPTIONS = handleCorsOptions;
