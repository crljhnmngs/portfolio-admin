import { login, logOut } from '@/utils/supabase/actions/auth';
import createClient from '@/utils/supabase/client';
import { LoginFormData } from '@/utils/validation/loginSchema';

jest.mock('@/utils/supabase/client');

const mockSignInWithPassword = jest.fn();
const mockSignOut = jest.fn();

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

(createClient as jest.Mock).mockImplementation(() => ({
    auth: {
        signInWithPassword: mockSignInWithPassword,
        signOut: mockSignOut,
    },
}));

describe('auth actions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return user and session on success', async () => {
            mockSignInWithPassword.mockResolvedValue({
                data: { user: { id: '1' }, session: { access_token: 'token' } },
                error: null,
            });
            const formData = {
                email: 'test@example.com',
                password: 'password123',
            };
            const result = await login(formData as LoginFormData);
            expect(mockSignInWithPassword).toHaveBeenCalledWith(formData);
            expect(result).toEqual({
                user: { id: '1' },
                session: { access_token: 'token' },
            });
        });

        it('should return error object on failure', async () => {
            mockSignInWithPassword.mockResolvedValue({
                data: {},
                error: { message: 'Invalid credentials' },
            });
            const formData = { email: 'test@example.com', password: 'wrong' };
            const result = await login(formData as LoginFormData);
            expect(result).toEqual({
                error: {
                    message: 'Login failed',
                    details: 'Invalid credentials',
                },
            });
        });
    });

    describe('logOut', () => {
        it('should return undefined on success', async () => {
            mockSignOut.mockResolvedValue({ error: null });
            const result = await logOut();
            expect(mockSignOut).toHaveBeenCalled();
            expect(result).toBeUndefined();
        });

        it('should return error object on failure', async () => {
            mockSignOut.mockResolvedValue({
                error: { message: 'Logout failed' },
            });
            const result = await logOut();
            expect(result).toEqual({ error: 'Logout failed' });
        });
    });
});
