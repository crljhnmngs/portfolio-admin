import createClient from '@/utils/supabase/client';
import { SupportedLanguagesResponse } from '@/types/global';

export const getSupportedLanguages =
    async (): Promise<SupportedLanguagesResponse> => {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('supported_languages')
                .select(
                    `
                    code,
                    name,
                    is_default
                `
                )
                .order('name', { ascending: true });

            if (error || !data) {
                throw (
                    error ??
                    new Error('No supported languages returned from database.')
                );
            }

            return data as SupportedLanguagesResponse;
        } catch (err) {
            console.error('Error fetching supported_languages:', err);
            throw err;
        }
    };
