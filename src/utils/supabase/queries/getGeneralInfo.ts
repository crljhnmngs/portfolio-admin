import createClient from '@/utils/supabase/client';
import { GeneralInfo, GeneralInfoResponse } from '@/types/global';

export const getGeneralInfo = async (): Promise<GeneralInfoResponse> => {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('general_info')
            .select(
                `
                id,
                email,
                resume_url,
                schedule_link,
                social_profiles (
                    platform,
                    url
                )
            `
            )
            .limit(1)
            .single<GeneralInfo>();

        if (error || !data) {
            throw error ?? new Error('No data returned from database.');
        }

        const socialLinks = data.social_profiles.reduce<Record<string, string>>(
            (acc, profile) => {
                acc[profile.platform.toLowerCase()] = profile.url;
                return acc;
            },
            {}
        );

        return {
            id: data.id,
            email: data.email,
            resumeUrl: data.resume_url,
            scheduleLink: data.schedule_link,
            socialLinks,
        };
    } catch (err) {
        console.error('Error fetching general_info:', err);
        throw err;
    }
};
