import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const GET = async (req: Request) => {
    try {
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

        return NextResponse.json({
            roles,
        });
    } catch (error) {
        console.error('Error fetching translated roles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch translated roles' },
            { status: 500 }
        );
    }
};
