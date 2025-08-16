import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const GET = async () => {
    try {
        const skills = await prisma.skills.findMany({
            select: {
                id: true,
                name: true,
                icon_url: true,
                category: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        return NextResponse.json({
            skills,
        });
    } catch (error) {
        console.error('Error fetching skills:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skills' },
            { status: 500 }
        );
    }
};
