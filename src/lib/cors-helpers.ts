import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];

export const handleCorsOptions = (req: Request) => {
    const origin = req.headers.get('origin');

    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
        return new NextResponse(null, { status: 403 });
    }

    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
        },
    });
};
