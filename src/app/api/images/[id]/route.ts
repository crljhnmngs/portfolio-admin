import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateSession } from '@/lib/auth-helpers';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limiter';
import { deleteFromCloudinary } from '@/lib/cloudinary';

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
            prefix: 'image-delete',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const { id: imageId } = await context.params;

        if (!imageId) {
            return NextResponse.json(
                { error: 'Image ID is required' },
                { status: 400 }
            );
        }

        // Get image to retrieve publicId
        const image = await prisma.image.findUnique({
            where: { id: imageId },
        });

        if (!image) {
            return NextResponse.json(
                { error: 'Image not found' },
                { status: 404 }
            );
        }

        // Delete from Cloudinary
        await deleteFromCloudinary(image.publicId);

        // Delete from database
        await prisma.image.delete({
            where: { id: imageId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    }
};
