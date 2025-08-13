import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
            supportedLanguages: languages,
        });
    } catch (error) {
        console.error('Error fetching supported languages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch supported languages' },
            { status: 500 }
        );
    }
};
