import { LoginFormData } from '@/utils/validation/loginSchema';
import createClient from '@/utils/supabase/client';

export const login = async (formData: LoginFormData) => {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword(formData);

    if (error) {
        return {
            error: {
                message: 'Login failed',
                details: error.message,
            },
        };
    }

    return { user: data.user, session: data.session };
};

export const logOut = async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { error: error.message };
    }

    return;
};
