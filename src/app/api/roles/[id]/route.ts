import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth';
import { UpsertRoleParams } from '@/types/global';

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
