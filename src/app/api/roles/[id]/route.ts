import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpsertRoleParams } from '@/types/global';
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
            prefix: 'role-upsert',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const { id: generalInfoId } = await context.params;
        const body: UpsertRoleParams = await req.json();

        if (!body.roleName?.trim()) {
            return NextResponse.json(
                { error: 'Role name is required' },
                { status: 400 }
            );
        }

        if (body.id) {
            await prisma.translated_roles.update({
                where: { id: body.id },
                data: {
                    role_name: body.roleName,
                },
            });
        } else {
            await prisma.translated_roles.create({
                data: {
                    general_info_id: generalInfoId,
                    language_code: body.languageCode,
                    role_name: body.roleName,
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error upserting role:', error);
        return NextResponse.json(
            { error: 'Failed to update role' },
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
            prefix: 'role-delete',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const { id: roleId } = await params;

        if (!roleId) {
            return NextResponse.json(
                { error: 'Role ID is required' },
                { status: 400 }
            );
        }

        await prisma.translated_roles.delete({
            where: { id: roleId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting role:', error);
        return NextResponse.json(
            { error: 'Failed to delete role' },
            { status: 500 }
        );
    }
};
