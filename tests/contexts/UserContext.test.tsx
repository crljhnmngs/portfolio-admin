import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProvider, useUser } from '@/contexts/UserContext';

jest.mock('@/utils/supabase/client', () => () => ({
    auth: {
        getSession: jest.fn().mockResolvedValue({
            data: {
                session: { user: { id: '1', email: 'test@example.com' } },
            },
        }),
        getUser: jest.fn().mockResolvedValue({
            data: { user: { id: '1', email: 'test@example.com' } },
        }),
        onAuthStateChange: jest.fn(() => ({
            data: { subscription: { unsubscribe: jest.fn() } },
        })),
    },
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

const TestComponent = () => {
    const { user, session, loading, signOut, refreshUser } = useUser();
    return (
        <div>
            <span data-testid="user">{user?.email}</span>
            <span data-testid="session">{session ? 'yes' : 'no'}</span>
            <span data-testid="loading">{loading ? 'yes' : 'no'}</span>
            <button onClick={signOut}>Sign Out</button>
            <button onClick={refreshUser}>Refresh</button>
        </div>
    );
};

describe('UserContext', () => {
    it('should provide user, session, loading, signOut, and refreshUser', async () => {
        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        await waitFor(() =>
            expect(screen.getByTestId('loading')).toHaveTextContent('no')
        );

        expect(screen.getByTestId('user')).toHaveTextContent(
            'test@example.com'
        );
        expect(screen.getByTestId('session')).toHaveTextContent('yes');
    });
});
