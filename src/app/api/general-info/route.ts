import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GeneralInfoResponse } from '@/types/global';

export const GET = async () => {
    try {
        const data = await prisma.general_info.findFirst({
            select: {
                id: true,
                email: true,
                resume_url: true,
                schedule_link: true,
                social_profiles: {
                    select: {
                        platform: true,
                        url: true,
                    },
                },
            },
        });

        if (!data) {
            return NextResponse.json(
                { error: 'No data found' },
                { status: 404 }
            );
        }

        const socialLinks = data.social_profiles.reduce<Record<string, string>>(
            (acc, profile) => {
                acc[profile.platform.toLowerCase()] = profile.url;
                return acc;
            },
            {}
        );

        const generalInfo: GeneralInfoResponse = {
            id: data.id,
            email: data.email,
            resumeUrl: data.resume_url,
            scheduleLink: data.schedule_link,
            socialLinks,
        };

        return NextResponse.json({ generalInfo });
    } catch (error) {
        console.error('Error fetching general_info:', error);
        return NextResponse.json(
            { error: 'Failed to fetch general info' },
            { status: 500 }
        );
    }
};
