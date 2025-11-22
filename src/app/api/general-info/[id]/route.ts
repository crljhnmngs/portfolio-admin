import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GeneralInfoFormData } from '@/utils/validation/generalInfoSchema';
import { validateSession } from '@/lib/auth-helpers';

export const PUT = async (
    req: Request,
    context: { params: Promise<{ id: string }> }
) => {
    try {
        const auth = await validateSession();
        if (!auth.valid) return auth.response;

        const { id } = await context.params;
        const body: GeneralInfoFormData = await req.json();

        const { email, resumeUrl, scheduleLink, ...socialLinks } = body;

        const updated = await prisma.general_info.upsert({
            where: { id },
            create: {
                id,
                email,
                resume_url: resumeUrl,
                schedule_link: scheduleLink,
                social_profiles: {
                    create: Object.entries(socialLinks).map(
                        ([platform, url]) => ({
                            platform,
                            url,
                        })
                    ),
                },
            },
            update: {
                email,
                resume_url: resumeUrl,
                schedule_link: scheduleLink,
                social_profiles: {
                    deleteMany: {},
                    create: Object.entries(socialLinks).map(
                        ([platform, url]) => ({
                            platform,
                            url,
                        })
                    ),
                },
            },
            include: {
                social_profiles: true,
            },
        });

        return NextResponse.json({ generalInfo: updated });
    } catch (error) {
        console.error('Error updating general_info:', error);
        return NextResponse.json(
            { error: 'Failed to update general info' },
            { status: 500 }
        );
    }
};
