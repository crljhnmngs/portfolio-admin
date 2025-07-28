import { UpsertLocalizedInfoParams } from '@/types/global';
import createClient from '@/utils/supabase/client';

export const upsertLocalizedInfo = async (
    params: UpsertLocalizedInfoParams
) => {
    const supabase = await createClient();

    try {
        const { error: upsertError } = await supabase
            .from('general_translations')
            .upsert(
                [
                    {
                        general_info_id: params.generalInfoId,
                        language_code: params.languageCode,
                        full_name: params.data.name,
                        current_company: params.data.current_company,
                        current_role: params.data.current_role,
                        about_me: params.data.about,
                        address: params.data.address,
                    },
                ],
                { onConflict: 'general_info_id,language_code' }
            );

        if (upsertError) throw upsertError;

        return true;
    } catch (err) {
        console.error('Error upserting localized_info:', err);
        throw err;
    }
};
