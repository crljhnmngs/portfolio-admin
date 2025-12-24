import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { lucia } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limiter';

export const POST = async (req: NextRequest) => {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing fields' },
                { status: 400 }
            );
        }

        const { success, limit, remaining, resetTime } = checkRateLimit(
            email.toLowerCase(),
            {
                windowMs: 15 * 60 * 1000, // 15 minutes
                maxAttempts: 5,
                prefix: 'login',
            }
        );

        if (!success) {
            const minutesUntilReset = Math.ceil(
                (resetTime - Date.now()) / 60000
            );

            return NextResponse.json(
                {
                    error: `Too many login attempts. Please try again in ${minutesUntilReset} minute${
                        minutesUntilReset !== 1 ? 's' : ''
                    }.`,
                    retryAfter: new Date(resetTime).toISOString(),
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': new Date(resetTime).toISOString(),
                    },
                }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        const userData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        const response = NextResponse.json({ user: userData });
        response.cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );

        return response;
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
