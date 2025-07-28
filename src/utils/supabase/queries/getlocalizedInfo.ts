import { LocalizedInfoResponse } from '@/types/global';
import createClient from '@/utils/supabase/client';

export const getLocalizedInfo = async ({
    generalInfoId,
    languageCode,
}: {
    generalInfoId: string;
    languageCode: string;
}): Promise<LocalizedInfoResponse | null> => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('general_translations')
        .select(
            `
      id,
      general_info_id,
      full_name,
      current_company,
      current_role,
      about_me,
      address
    `
        )
        .eq('general_info_id', generalInfoId)
        .eq('language_code', languageCode)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching localized_info:', error);
        throw error;
    }

    if (!data) return null;

    return {
        id: data.id,
        general_info_id: data.general_info_id,
        full_name: data.full_name,
        current_company: data.current_company,
        current_role: data.current_role,
        about_me: data.about_me,
        address: data.address,
    };
};
