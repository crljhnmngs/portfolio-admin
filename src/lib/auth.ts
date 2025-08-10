import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import prisma from './prisma';
import { Lucia, Session, User } from 'lucia';
import { cache } from 'react';
import { cookies } from 'next/headers';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === 'production',
        },
    },
    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            email: attributes.email,
            firstName: attributes.firstName,
            lastName: attributes.lastName,
        };
    },
});

export const getUser = cache(
    async (): Promise<
        { user: User; session: Session } | { user: null; session: null }
    > => {
        const sessionId =
            (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
        if (!sessionId) {
            return {
                user: null,
                session: null,
            };
        }

        const result = await lucia.validateSession(sessionId);

        try {
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(
                    result.session.id
                );
                (await cookies()).set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                );
            }
            if (!result.session) {
                const sessionCookie = lucia.createBlankSessionCookie();
                (await cookies()).set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                );
            }
        } catch {}
        return result;
    }
);

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        UserId: string;
        DatabaseUserAttributes: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    }
}
