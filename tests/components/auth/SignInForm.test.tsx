import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignInForm from '@/components/auth/SignInForm';
import toast from 'react-hot-toast';

// Track mock login function across tests
const mockUserLogin = jest.fn();

// Mock useLogin hook
jest.mock('@/hooks/useLogin', () => ({
    useLogin: () => ({
        userLogin: mockUserLogin,
        isLoading: false,
    }),
}));

// Mock Supabase client
jest.mock('@/utils/supabase/client', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        auth: {
            signInWithPassword: jest.fn().mockResolvedValue({
                data: {
                    user: { id: '1' },
                    session: { access_token: 'token' },
                },
                error: null,
            }),
        },
    })),
}));

// Mock ESM-only modules before use
jest.mock('@supabase/ssr', () => ({
    createBrowserClient: jest.fn(() => ({
        auth: {
            signInWithPassword: jest.fn(),
        },
    })),
}));
jest.mock('isows', () => ({}));
jest.mock('react-hot-toast');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

import { useRouter } from 'next/navigation';

const renderWithQueryClient = (ui: React.ReactElement) => {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe('SignInForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUserLogin.mockReset();
    });

    it('should render all input fields and buttons', () => {
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        renderWithQueryClient(<SignInForm />);
        expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/info@gmail.com/i)
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/Enter your password/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Keep me logged in/i)).toBeInTheDocument();
        expect(screen.getByText(/Forgot password/i)).toBeInTheDocument();
    });

    it('should check and unchecks the checkbox', () => {
        renderWithQueryClient(<SignInForm />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
    });

    it('should render social sign-in buttons', () => {
        renderWithQueryClient(<SignInForm />);
        expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign in with GitHub/i)).toBeInTheDocument();
    });

    it('should call userLogin with form data on submit', async () => {
        renderWithQueryClient(<SignInForm />);
        fireEvent.change(screen.getByPlaceholderText(/info@gmail.com/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
            target: { value: 'password123' },
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('sign-in-button'));
        });

        expect(mockUserLogin).toHaveBeenCalledWith(
            expect.objectContaining({
                email: 'test@example.com',
                password: 'password123',
            }),
            expect.any(Object) // mutation options (e.g. onSuccess)
        );
    });

    it('should show error toast on login error', async () => {
        mockUserLogin.mockImplementation((_data, { onSuccess }) => {
            onSuccess({ error: { message: 'Invalid credentials' } });
        });

        renderWithQueryClient(<SignInForm />);
        fireEvent.change(screen.getByPlaceholderText(/info@gmail.com/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
            target: { value: 'password123' },
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('sign-in-button'));
        });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ position: 'top-right' })
            );
        });
    });

    it('should show success toast and navigates on successful login', async () => {
        const push = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push });

        mockUserLogin.mockImplementation((_data, { onSuccess }) => {
            onSuccess({
                user: { id: '1' },
                session: { access_token: 'token' },
            });
        });

        renderWithQueryClient(<SignInForm />);
        fireEvent.change(screen.getByPlaceholderText(/info@gmail.com/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
            target: { value: 'password123' },
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('sign-in-button'));
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                'Login successful!',
                expect.objectContaining({ position: 'top-right' })
            );
            expect(push).toHaveBeenCalledWith('/dashboard');
        });
    });
});
