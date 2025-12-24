import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpsertEducationParams } from '@/types/global';
import { validateSession } from '@/lib/auth-helpers';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limiter';

export const PUT = async (
    req: Request,
    context: { params: Promise<{ id: string }> }
) => {
    try {
        const auth = await validateSession();

        if (!auth.valid) return auth.response;

        if (!auth.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const rateLimitResult = checkRateLimit(auth.user.id, {
            windowMs: 5 * 60 * 1000,
            maxAttempts: 20,
            prefix: 'education-upsert',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const { id: educationId } = await context.params;
        const body: UpsertEducationParams = await req.json();

        // Validation
        if (!body.data.school?.trim()) {
            return NextResponse.json(
                { error: 'School name is required' },
                { status: 400 }
            );
        }

        if (!body.languageCode?.trim()) {
            return NextResponse.json(
                { error: 'Language code is required' },
                { status: 400 }
            );
        }

        // Helper function to get or create tech IDs
        const getOrCreateTechIds = async (techNames: string[]) => {
            const techIds: string[] = [];

            for (const techName of techNames) {
                const tech = await prisma.tech.upsert({
                    where: { name: techName.trim() },
                    update: {},
                    create: { name: techName.trim() },
                });
                techIds.push(tech.id);
            }

            return techIds;
        };

        if (educationId === 'add') {
            // CREATE NEW EDUCATION
            const educationTechIds =
                body.data.tech && body.data.tech.length > 0
                    ? await getOrCreateTechIds(body.data.tech)
                    : [];

            const education = await prisma.educations.create({
                data: {
                    school: body.data.school,
                    track: body.data.track,
                    course: body.data.course,
                    start_date: body.data.start_date,
                    end_date: body.data.end_date,
                    logo_url: body.data.logo_url,
                    language_code: body.languageCode,

                    education_tech: {
                        create: educationTechIds.map((techId) => ({
                            tech_id: techId,
                        })),
                    },
                },
                include: {
                    education_tech: {
                        include: { tech: true },
                    },
                },
            });

            return NextResponse.json({ success: true, data: education });
        } else {
            // UPDATE EXISTING EDUCATION
            await prisma.education_tech.deleteMany({
                where: { education_id: educationId },
            });

            const educationTechIds =
                body.data.tech && body.data.tech.length > 0
                    ? await getOrCreateTechIds(body.data.tech)
                    : [];

            const education = await prisma.educations.update({
                where: { id: educationId },
                data: {
                    school: body.data.school,
                    track: body.data.track,
                    course: body.data.course,
                    start_date: body.data.start_date,
                    end_date: body.data.end_date,
                    logo_url: body.data.logo_url,
                    language_code: body.languageCode,

                    education_tech: {
                        create: educationTechIds.map((techId) => ({
                            tech_id: techId,
                        })),
                    },
                },
                include: {
                    education_tech: {
                        include: { tech: true },
                    },
                },
            });

            return NextResponse.json({ success: true, data: education });
        }
    } catch (error) {
        console.error('Error upserting education:', error);
        return NextResponse.json(
            { error: 'Failed to upsert education' },
            { status: 500 }
        );
    }
};

export const DELETE = async (
    _req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const auth = await validateSession();
        if (!auth.valid) return auth.response;

        if (!auth.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const rateLimitResult = checkRateLimit(auth.user.id, {
            windowMs: 5 * 60 * 1000,
            maxAttempts: 10,
            prefix: 'education-delete',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const { id: educationId } = await params;

        if (!educationId) {
            return NextResponse.json(
                { error: 'Valid education ID is required' },
                { status: 400 }
            );
        }

        const existingEducation = await prisma.educations.findUnique({
            where: { id: educationId },
            select: { id: true, school: true, course: true },
        });

        if (!existingEducation) {
            return NextResponse.json(
                { error: 'Education not found' },
                { status: 404 }
            );
        }

        await prisma.educations.delete({
            where: { id: educationId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting education:', error);
        return NextResponse.json(
            { error: 'Failed to delete education' },
            { status: 500 }
        );
    }
};
