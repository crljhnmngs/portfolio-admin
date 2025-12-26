import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpsertSkillParams } from '@/types/global';
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
            prefix: 'skill-upsert',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const { id: skillId } = await context.params;
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
            maxAttempts: 10,
            prefix: 'skill-delete',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const { id: skillId } = await context.params;

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
