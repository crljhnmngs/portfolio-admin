'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import createClient from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { logOut } from '@/utils/supabase/actions/auth';

interface UserContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const refreshUser = async () => {
        try {
            const {
                data: { user: currentUser },
                error,
            } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
                setUser(null);
                setSession(null);
            } else {
                setUser(currentUser);
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
            setUser(null);
            setSession(null);
        }
    };

    const signOut = async () => {
        try {
            await logOut();
            setUser(null);
            setSession(null);
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const {
                data: { session: initialSession },
            } = await supabase.auth.getSession();
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            setLoading(false);
        };

        getInitialSession();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const value = {
        user,
        session,
        loading,
        signOut,
        refreshUser,
    };

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};
