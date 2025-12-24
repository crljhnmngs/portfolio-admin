import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpsertExperienceParams, SubItem, Project } from '@/types/global';
import { validateSession } from '@/lib/auth-helpers';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limiter';

// Helper Functions
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

const processProjects = async (projects: Project[]) => {
    if (!projects || projects.length === 0) return [];

    return Promise.all(
        projects.map(async (project) => {
            const projectTechIds =
                project.tech && project.tech.length > 0
                    ? await getOrCreateTechIds(project.tech)
                    : [];

            return {
                description: project.description,
                created_at: project.created_at,
                project_tech: {
                    create: projectTechIds.map((techId) => ({
                        tech_id: techId,
                    })),
                },
            };
        })
    );
};

const processSubItems = async (subItems: SubItem[] | undefined) => {
    if (!subItems || subItems.length === 0) return [];

    return Promise.all(
        subItems.map(async (subItem) => {
            const projectsData = await processProjects(subItem.projects);

            return {
                position: subItem.position,
                setup: subItem.setup,
                start_date: subItem.start_date,
                end_date: subItem.end_date,
                projects: {
                    create: projectsData,
                },
            };
        })
    );
};

const prepareExperienceData = async (body: UpsertExperienceParams) => {
    const [experienceTechIds, subItemsData] = await Promise.all([
        body.data.tech && body.data.tech.length > 0
            ? getOrCreateTechIds(body.data.tech)
            : [],
        processSubItems(body.data.sub_items),
    ]);

    return {
        // Core experience fields
        company: body.data.company,
        role: body.data.role,
        description: body.data.description,
        logo: body.data.logo,
        link: body.data.link,
        start_date: body.data.start_date,
        end_date: body.data.end_date,
        language_code: body.languageCode,

        // Relational data
        experience_tech: {
            create: experienceTechIds.map((techId) => ({
                tech_id: techId,
            })),
        },
        sub_items: {
            create: subItemsData,
        },
    };
};

// Query configuration for including all nested relations
const includeRelations = {
    experience_tech: {
        include: { tech: true },
    },
    sub_items: {
        include: {
            projects: {
                include: {
                    project_tech: {
                        include: { tech: true },
                    },
                },
            },
        },
    },
};

// Validation
const validateRequest = (body: UpsertExperienceParams) => {
    if (!body.data.company?.trim()) {
        return NextResponse.json(
            { error: 'Company name is required' },
            { status: 400 }
        );
    }

    if (!body.languageCode?.trim()) {
        return NextResponse.json(
            { error: 'Language code is required' },
            { status: 400 }
        );
    }

    return null;
};

// Error handling
const handleError = (error: unknown) => {
    console.error('Error upserting experience:', error);

    if (error instanceof Error) {
        if (error.message.includes('Foreign key constraint')) {
            return NextResponse.json(
                { error: 'Invalid language code' },
                { status: 400 }
            );
        }
        if (error.message.includes('P2002')) {
            return NextResponse.json(
                { error: 'Duplicate entry detected' },
                { status: 400 }
            );
        }
    }

    return NextResponse.json(
        { error: 'Failed to upsert experience' },
        { status: 500 }
    );
};

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
            prefix: 'experience-upsert',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const { id: experienceId } = await context.params;
        const body: UpsertExperienceParams = await req.json();

        // Validate request
        const validationError = validateRequest(body);
        if (validationError) return validationError;

        // Prepare data structure
        const experienceData = await prepareExperienceData(body);

        let experience;

        if (experienceId === 'add') {
            // CREATE
            experience = await prisma.experiences.create({
                data: experienceData,
                include: includeRelations,
            });
        } else {
            // UPDATE
            await prisma.$transaction([
                prisma.experience_tech.deleteMany({
                    where: { experience_id: experienceId },
                }),
                prisma.sub_items.deleteMany({
                    where: { experience_id: experienceId },
                }),
            ]);

            experience = await prisma.experiences.update({
                where: { id: experienceId },
                data: experienceData,
                include: includeRelations,
            });
        }

        return NextResponse.json({ success: true, data: experience });
    } catch (error) {
        return handleError(error);
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
            prefix: 'experience-delete',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const { id: experienceId } = await params;

        if (!experienceId) {
            return NextResponse.json(
                { error: 'ExperienceId ID is required' },
                { status: 400 }
            );
        }

        const existingExperience = await prisma.experiences.findUnique({
            where: { id: experienceId },
            select: { id: true, company: true },
        });

        if (!existingExperience) {
            return NextResponse.json(
                { error: 'Experience not found' },
                { status: 404 }
            );
        }

        await prisma.experiences.delete({
            where: { id: experienceId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting experience:', error);
        return NextResponse.json(
            { error: 'Failed to delete experience' },
            { status: 500 }
        );
    }
};
