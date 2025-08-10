import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GeneralInfoFormData } from '@/utils/validation/generalInfoSchema';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth';

export const PUT = async (
    req: Request,
    context: { params: Promise<{ id: string }> }
) => {
    try {
        const cookieStore = await cookies();
        const sessionId =
            cookieStore.get(lucia.sessionCookieName)?.value ?? null;

        if (!sessionId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { session, user } = await lucia.validateSession(sessionId);

        if (!session || !user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
