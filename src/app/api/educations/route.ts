import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const GET = async (req: Request) => {
    try {
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

        return NextResponse.json({ educations: transformedEducations });
    } catch (error) {
        console.error('Error fetching educations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch educations' },
            { status: 500 }
        );
    }
};
