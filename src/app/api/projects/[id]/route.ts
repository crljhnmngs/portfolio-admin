import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpsertProjectParams } from '@/types/global';
import { validateSession } from '@/lib/auth-helpers';
import { projectSchema } from '@/utils/validation/projectSchema';

export const PUT = async (
    req: Request,
    context: { params: Promise<{ id: string }> }
) => {
    try {
        const auth = await validateSession();
        if (!auth.valid) return auth.response;

        const { id: projectId } = await context.params;
        const body: UpsertProjectParams = await req.json();

        const validationResult = projectSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                },
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

        if (projectId === 'add') {
            // CREATE NEW PROJECT
            const projectTechIds = await getOrCreateTechIds(body.tech);

            const project = await prisma.portfolio_projects.create({
                data: {
                    name: body.name,
                    image_url: body.image_url,
                    about: body.about,
                    date: body.date,
                    github: body.github || null,
                    live: body.live || null,
                    new: body.new ?? false,
                    dev: body.dev ?? false,
                    language_code: body.language_code,

                    portfolio_project_tech: {
                        create: projectTechIds.map((techId) => ({
                            tech_id: techId,
                        })),
                    },
                },
                include: {
                    portfolio_project_tech: {
                        include: { tech: true },
                    },
                },
            });

            return NextResponse.json({ success: true, data: project });
        } else {
            // UPDATE EXISTING PROJECT
            // Delete existing tech relations
            await prisma.portfolio_project_tech.deleteMany({
                where: { portfolio_project_id: projectId },
            });

            const projectTechIds = await getOrCreateTechIds(body.tech);

            const project = await prisma.portfolio_projects.update({
                where: { id: projectId },
                data: {
                    name: body.name,
                    image_url: body.image_url,
                    about: body.about,
                    date: body.date,
                    github: body.github || null,
                    live: body.live || null,
                    new: body.new ?? false,
                    dev: body.dev ?? false,
                    language_code: body.language_code,

                    portfolio_project_tech: {
                        create: projectTechIds.map((techId) => ({
                            tech_id: techId,
                        })),
                    },
                },
                include: {
                    portfolio_project_tech: {
                        include: { tech: true },
                    },
                },
            });

            return NextResponse.json({ success: true, data: project });
        }
    } catch (error) {
        console.error('Error upserting project:', error);
        return NextResponse.json(
            { error: 'Failed to upsert project' },
            { status: 500 }
        );
    }
};

export const DELETE = async (
    _req: Request,
    context: { params: Promise<{ id: string }> }
) => {
    try {
        const auth = await validateSession();
        if (!auth.valid) return auth.response;

        const { id: projectId } = await context.params;

        if (!projectId) {
            return NextResponse.json(
                { error: 'Valid project ID is required' },
                { status: 400 }
            );
        }

        const existingProject = await prisma.portfolio_projects.findUnique({
            where: { id: projectId },
            select: { id: true, name: true },
        });

        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        await prisma.portfolio_projects.delete({
            where: { id: projectId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
};
