import { renderHook, act } from '@testing-library/react';
import { useLogin } from '@/hooks/auth/useLogin';
import * as reactQuery from '@tanstack/react-query';
import * as authActions from '@/utils/supabase/actions/auth';

jest.mock('@tanstack/react-query');
jest.mock('@/utils/supabase/actions/auth');
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

describe('useLogin', () => {
    it('should call login with correct data and return mutation state', async () => {
        const mutateMock = jest.fn();
        const isPending = false;
        const mutationState = { mutate: mutateMock, isPending };
        (reactQuery.useMutation as jest.Mock).mockReturnValue(mutationState);
        (authActions.login as jest.Mock).mockResolvedValue({
            user: { id: '1' },
            session: { access_token: 'token' },
        });

        const { result } = renderHook(() => useLogin());

        expect(result.current.userLogin).toBe(mutateMock);
        expect(result.current.isLoading).toBe(isPending);
        expect(result.current.mutate).toBe(mutateMock);
    });

    it('should call login with provided data', async () => {
        const mutateFn = jest.fn();
        (reactQuery.useMutation as jest.Mock).mockReturnValue({
            mutate: mutateFn,
            isPending: false,
        });
        (authActions.login as jest.Mock).mockResolvedValue({
            user: { id: '1' },
            session: { access_token: 'token' },
        });

        const { result } = renderHook(() => useLogin());
        const data = { email: 'test@example.com', password: 'password123' };

        act(() => {
            result.current.userLogin(data);
        });

        expect(mutateFn).toHaveBeenCalledWith(data);
    });
});
