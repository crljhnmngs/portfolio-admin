import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LocalizedInfoResponse } from '@/types/global';

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const generalInfoId = searchParams.get('generalInfoId') || '';
    const languageCode = searchParams.get('languageCode') || '';

    if (!generalInfoId || !languageCode) {
        return NextResponse.json(
            { error: 'Missing generalInfoId or languageCode' },
            { status: 400 }
        );
    }

    try {
        const data = await prisma.general_translations.findFirst({
            where: {
                general_info_id: generalInfoId,
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

        const localizedInfo: LocalizedInfoResponse = {
            id: data.id,
            general_info_id: data.general_info_id,
            full_name: data.full_name,
            current_company: data.current_company,
            current_role: data.current_role,
            about_me: data.about_me,
            address: data.address,
        };

        return NextResponse.json({ localizedInfo });
    } catch (error) {
        console.error('Error fetching localized_info:', error);
        return NextResponse.json(
            { error: 'Failed to fetch localized info' },
            { status: 500 }
        );
    }
};
