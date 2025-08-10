'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface LuciaUser {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

interface LuciaSession {
    id: string;
    expiresAt: string;
}

interface UserContextType {
    user: LuciaUser | null;
    session: LuciaSession | null;
    isUserLoading: boolean;
    isSignOutLoading: boolean;
    signOut: () => Promise<void>;
    refreshUser: () => void;
    isLoggedOut: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

const axiosInstance = axios.create({
    withCredentials: true,
});

const fetchSession = async () => {
    const res = await axiosInstance.get('/api/auth/session');
    return res.data;
};

const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message, {
            position: 'top-right',
        });
    } else {
        toast.error('An unexpected error occurred.', {
            position: 'top-right',
        });
    }
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['auth', 'session'],
        queryFn: async () => {
            try {
                return await fetchSession();
            } catch (err) {
                handleApiError(err);
            }
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const isLoggedOut = !isLoading && (!data?.user || !data?.session);

    const [signOutLoading, setSignOutLoading] = useState(false);

    const signOut = async () => {
        setSignOutLoading(true);
        try {
            await axiosInstance.post('/api/auth/logout');
            queryClient.removeQueries({ queryKey: ['auth', 'session'] });
            router.refresh();
        } catch (error) {
            handleApiError(error);
        } finally {
            setSignOutLoading(false);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user: data?.user || null,
                session: data?.session || null,
                isUserLoading: isLoading,
                isSignOutLoading: signOutLoading,
                signOut,
                refreshUser: refetch,
                isLoggedOut,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
