import { LocalizedInfoFormData } from '@/utils/validation/localizedInfoSchema';

export type SocialProfile = {
    platform: string;
    url: string;
};

export type GeneralInfo = {
    id: string;
    email: string;
    resume_url: string;
    schedule_link: string;
    social_profiles: SocialProfile[];
};

export type GeneralInfoResponse = {
    id: string;
    email: string;
    resumeUrl: string;
    scheduleLink: string;
    socialLinks: Record<string, string>;
};

export type SupportedLanguage = {
    code: string;
    name: string;
    is_default?: boolean;
};

export type SupportedLanguagesResponse = SupportedLanguage[];

export type LocalizedInfoResponse = {
    id: string;
    general_info_id: string;
    full_name: string;
    current_company: string;
    current_role: string;
    about_me: string;
    address: string;
};

export type UpsertLocalizedInfoParams = {
    generalInfoId: string;
    languageCode: string;
    data: LocalizedInfoFormData;
};
