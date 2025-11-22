import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpsertSkillParams } from '@/types/global';
import { validateSession } from '@/lib/auth-helpers';

export const PUT = async (
    req: Request,
    { params }: { params: { id?: string } }
) => {
    try {
        const auth = await validateSession();
        if (!auth.valid) return auth.response;

        const { id: skillId } = await params;
        const body: UpsertSkillParams = await req.json();

        if (!body.name?.trim()) {
            return NextResponse.json(
                { error: 'Skill name is required' },
                { status: 400 }
            );
        }

        if (skillId === 'add') {
            await prisma.skills.create({
                data: {
                    name: body.name,
                    icon_url: body.icon_url,
                    category: body.category,
                },
            });
        } else {
            await prisma.skills.update({
                where: { id: body.id },
                data: {
                    name: body.name,
                    icon_url: body.icon_url,
                    category: body.category,
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error upserting skill:', error);
        return NextResponse.json(
            { error: 'Failed to upserting skill' },
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

        const { id: skillId } = await params;

        if (!skillId) {
            return NextResponse.json(
                { error: 'Skill ID is required' },
                { status: 400 }
            );
        }

        await prisma.skills.delete({
            where: { id: skillId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting skill:', error);
        return NextResponse.json(
            { error: 'Failed to delete skill' },
            { status: 500 }
        );
    }
};
