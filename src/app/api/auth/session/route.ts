import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';

export const GET = async () => {
    const cookieStore = await cookies();

    const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
        return Response.json({ user: null, session: null });
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (!session) {
        return Response.json({ user: null, session: null });
    }

    return Response.json({
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        session: {
            id: session.id,
            expiresAt: session.expiresAt,
        },
    });
};
