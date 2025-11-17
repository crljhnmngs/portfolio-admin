import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth';
import { UpsertExperienceParams } from '@/types/global';

export const PUT = async (
    req: Request,
    context: { params: Promise<{ id: string }> }
) => {
    try {
        const cookieStore = await cookies();
        const sessionId =
            cookieStore.get(lucia.sessionCookieName)?.value ?? null;

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { session, user } = await lucia.validateSession(sessionId);
        if (!session || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id: experienceId } = await context.params;
        const body: UpsertExperienceParams = await req.json();

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

        // TODO: Add comments for what this part is doing.

        if (experienceId === 'add') {
            // CREATE NEW EXPERIENCE

            // Get or create all tech items first
            const experienceTechIds =
                body.data.tech && body.data.tech.length > 0
                    ? await getOrCreateTechIds(body.data.tech)
                    : [];

            // Process sub_items and their projects
            const subItemsData =
                body.data.sub_items && body.data.sub_items.length > 0
                    ? await Promise.all(
                          body.data.sub_items.map(async (subItem) => {
                              const projectsData =
                                  subItem.projects &&
                                  subItem.projects.length > 0
                                      ? await Promise.all(
                                            subItem.projects.map(
                                                async (project) => {
                                                    const projectTechIds =
                                                        project.tech &&
                                                        project.tech.length > 0
                                                            ? await getOrCreateTechIds(
                                                                  project.tech
                                                              )
                                                            : [];

                                                    return {
                                                        description:
                                                            project.description,
                                                        project_tech: {
                                                            create: projectTechIds.map(
                                                                (techId) => ({
                                                                    tech_id:
                                                                        techId,
                                                                })
                                                            ),
                                                        },
                                                    };
                                                }
                                            )
                                        )
                                      : [];

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
                      )
                    : [];

            // Create the experience
            const experience = await prisma.experiences.create({
                data: {
                    company: body.data.company,
                    role: body.data.role,
                    description: body.data.description,
                    logo: body.data.logo,
                    link: body.data.link,
                    start_date: body.data.start_date,
                    end_date: body.data.end_date,
                    language_code: body.languageCode,

                    // Create tech relations
                    experience_tech: {
                        create: experienceTechIds.map((techId) => ({
                            tech_id: techId,
                        })),
                    },

                    // Create sub_items
                    sub_items: {
                        create: subItemsData,
                    },
                },
                include: {
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
                },
            });

            return NextResponse.json({ success: true, data: experience });
        } else {
            // UPDATE EXISTING EXPERIENCE

            // Delete existing relations
            await prisma.$transaction([
                prisma.experience_tech.deleteMany({
                    where: { experience_id: experienceId },
                }),
                prisma.sub_items.deleteMany({
                    where: { experience_id: experienceId },
                }),
            ]);

            // Get or create all tech items first
            const experienceTechIds =
                body.data.tech && body.data.tech.length > 0
                    ? await getOrCreateTechIds(body.data.tech)
                    : [];

            // Process sub_items and their projects
            const subItemsData =
                body.data.sub_items && body.data.sub_items.length > 0
                    ? await Promise.all(
                          body.data.sub_items.map(async (subItem) => {
                              const projectsData =
                                  subItem.projects &&
                                  subItem.projects.length > 0
                                      ? await Promise.all(
                                            subItem.projects.map(
                                                async (project) => {
                                                    const projectTechIds =
                                                        project.tech &&
                                                        project.tech.length > 0
                                                            ? await getOrCreateTechIds(
                                                                  project.tech
                                                              )
                                                            : [];

                                                    return {
                                                        description:
                                                            project.description,
                                                        project_tech: {
                                                            create: projectTechIds.map(
                                                                (techId) => ({
                                                                    tech_id:
                                                                        techId,
                                                                })
                                                            ),
                                                        },
                                                    };
                                                }
                                            )
                                        )
                                      : [];

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
                      )
                    : [];

            // Update the experience
            const experience = await prisma.experiences.update({
                where: { id: experienceId },
                data: {
                    company: body.data.company,
                    role: body.data.role,
                    description: body.data.description,
                    logo: body.data.logo,
                    link: body.data.link,
                    start_date: body.data.start_date,
                    end_date: body.data.end_date,
                    language_code: body.languageCode,

                    // Create tech relations
                    experience_tech: {
                        create: experienceTechIds.map((techId) => ({
                            tech_id: techId,
                        })),
                    },

                    // Create sub_items
                    sub_items: {
                        create: subItemsData,
                    },
                },
                include: {
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
                },
            });

            return NextResponse.json({ success: true, data: experience });
        }
    } catch (error) {
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
    }
};
