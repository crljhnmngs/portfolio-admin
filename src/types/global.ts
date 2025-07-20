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
