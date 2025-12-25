import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateSession } from '@/lib/auth-helpers';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limiter';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export const POST = async (req: Request) => {
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
            prefix: 'image-upload',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const formData = await req.formData();
        const files = formData.getAll('images') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No images provided' },
                { status: 400 }
            );
        }

        const uploadedImages = [];
        const errors = [];

        for (const file of files) {
            try {
                const { url, publicId } = await uploadToCloudinary(file);

                try {
                    const image = await prisma.image.create({
                        data: {
                            url,
                            publicId,
                        },
                    });

                    uploadedImages.push(image);
                } catch (error) {
                    console.error('Error creating data in database: ', error);
                    // If database create fails, delete uploaded image
                    await deleteFromCloudinary(publicId).catch((err) =>
                        console.error(
                            `Failed to delete ${publicId} from Cloudinary:`,
                            err
                        )
                    );
                    errors.push({
                        file: file.name,
                        error: 'Failed to save to database',
                    });
                }
            } catch (uploadError) {
                // If Cloudinary upload fails, just log and continue
                console.error('Error uploading images: ', uploadError);
                errors.push({
                    file: file.name,
                    error: 'Failed to upload to Cloudinary',
                });
            }
        }

        if (uploadedImages.length > 0) {
            return NextResponse.json({
                success: true,
                images: uploadedImages,
                ...(errors.length > 0 && { errors }),
            });
        }

        // If no images uploaded successfully, return error
        return NextResponse.json(
            {
                error: 'Failed to upload all images',
                errors,
            },
            { status: 500 }
        );
    } catch (error) {
        console.error('Error uploading images:', error);
        return NextResponse.json(
            { error: 'Failed to upload images' },
            { status: 500 }
        );
    }
};

export const GET = async () => {
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
            windowMs: 1 * 60 * 1000,
            maxAttempts: 60,
            prefix: 'images-get',
        });

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const images = await prisma.image.findMany({
            select: {
                id: true,
                url: true,
                publicId: true,
                created_at: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        const response = NextResponse.json({
            images,
        });

        return response;
    } catch (error) {
        console.error('Error fetching images:', error);
        return NextResponse.json(
            { error: 'Failed to fetch images' },
            { status: 500 }
        );
    }
};
