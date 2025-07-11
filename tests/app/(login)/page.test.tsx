import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SignIn from '@/app/(login)/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/contexts/UserContext';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Optional: mock useLogin hook
jest.mock('@/hooks/useLogin', () => ({
    useLogin: () => ({
        userLogin: jest.fn(),
        isLoading: false,
    }),
}));

// Optional: mock Supabase client
jest.mock('@/utils/supabase/client', () => () => ({
    auth: {
        signInWithPassword: jest.fn(),
        onAuthStateChange: jest.fn(() => ({
            data: { subscription: { unsubscribe: jest.fn() } },
        })),
        getSession: jest.fn().mockResolvedValue({
            data: {
                session: { user: { id: '1', email: 'test@example.com' } },
            },
        }),
        getUser: jest.fn().mockResolvedValue({
            data: { user: { id: '1', email: 'test@example.com' } },
        }),
    },
}));

// Utility to wrap with QueryClient and UserProvider
const renderWithProviders = (ui: React.ReactElement) => {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <UserProvider>{ui}</UserProvider>
        </QueryClientProvider>
    );
};

describe('SignIn page', () => {
    it('should render the SignInForm', async () => {
        renderWithProviders(<SignIn />);
        await waitFor(() =>
            expect(
                screen.getAllByRole('button', { name: /sign in/i }).length
            ).toBeGreaterThan(0)
        );
    });
});
