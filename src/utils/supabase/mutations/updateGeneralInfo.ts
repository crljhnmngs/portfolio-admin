import createClient from '@/utils/supabase/client';
import { GeneralInfoFormData } from '@/utils/validation/generalInfoSchema';

export const updateGeneralInfo = async (
    data: GeneralInfoFormData,
    id: string
) => {
    const { email, resumeUrl, scheduleLink, ...socialLinks } = data;
    const supabase = await createClient();

    try {
        const { error: updateError } = await supabase
            .from('general_info')
            .update({
                email,
                resume_url: resumeUrl,
                schedule_link: scheduleLink,
            })
            .eq('id', id);

        if (updateError) throw updateError;

        const socialProfiles = Object.entries(socialLinks).map(
            ([platform, url]) => ({
                platform,
                url,
                general_info_id: id,
            })
        );

        const { error: deleteError } = await supabase
            .from('social_profiles')
            .delete()
            .eq('general_info_id', id);

        if (deleteError) throw deleteError;

        const { error: insertError } = await supabase
            .from('social_profiles')
            .insert(socialProfiles);

        if (insertError) throw insertError;

        return true;
    } catch (err) {
        console.error('Error updating general_info:', err);
        throw err;
    }
};
