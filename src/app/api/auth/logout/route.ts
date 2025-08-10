import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';

export const POST = async () => {
    const cookieStore = await cookies();

    const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
    if (!sessionId) {
        return Response.json({ error: 'No session found' }, { status: 401 });
    }

    await lucia.invalidateSession(sessionId);

    cookieStore.set({
        name: lucia.sessionCookieName,
        value: '',
        path: '/',
        maxAge: 0,
    });

    return Response.json({ success: true });
};
