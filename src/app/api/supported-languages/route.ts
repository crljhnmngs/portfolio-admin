import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SupportedLanguagesResponse } from '@/types/global';

export const GET = async () => {
    try {
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

        return NextResponse.json({
            supportedLanguages: languages as SupportedLanguagesResponse,
        });
    } catch (error) {
        console.error('Error fetching supported languages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch supported languages' },
            { status: 500 }
        );
    }
};
