import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpsertLocalizedInfoParams } from '@/types/global';
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
            prefix: 'localized-info-upsert',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
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
