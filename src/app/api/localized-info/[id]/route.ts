import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpsertLocalizedInfoParams } from '@/types/global';
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
        const body: UpsertLocalizedInfoParams = await req.json();

        await prisma.general_translations.upsert({
            where: {
                general_info_id_language_code: {
                    general_info_id: id,
                    language_code: body.languageCode,
                },
            },
            update: {
                full_name: body.data.name,
                current_company: body.data.current_company,
                current_role: body.data.current_role,
                about_me: body.data.about,
                address: body.data.address,
            },
            create: {
                general_info_id: id,
                language_code: body.languageCode,
                full_name: body.data.name ?? '',
                current_company: body.data.current_company,
                current_role: body.data.current_role,
                about_me: body.data.about,
                address: body.data.address,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error upserting localized_info:', error);
        return NextResponse.json(
            { error: 'Failed to update localized info' },
            { status: 500 }
        );
    }
};
