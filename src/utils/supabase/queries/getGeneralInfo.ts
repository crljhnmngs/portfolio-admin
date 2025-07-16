import createClient from '@/utils/supabase/client';
import { GeneralInfo, GeneralInfoResponse } from '@/types/global';

export const getGeneralInfo = async (): Promise<GeneralInfoResponse> => {
    const supabase = await createClient();

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

    if (error) {
        console.error('Error fetching general_info:', error);
        throw error;
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
};
