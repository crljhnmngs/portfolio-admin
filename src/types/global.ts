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
    email: string | null;
    resumeUrl: string | null;
    scheduleLink: string | null;
    socialLinks: Record<string, string>;
};

export type GeneralInfoApiResponse = {
    generalInfo: GeneralInfoResponse;
};

export type SupportedLanguage = {
    code: string;
    name: string;
    is_default?: boolean;
};

export type SupportedLanguagesApiResponse = {
    supportedLanguages: SupportedLanguage[];
};

export type LocalizedInfo = {
    id: string;
    general_info_id: string | null;
    full_name: string;
    current_company: string | null;
    current_role: string | null;
    about_me: string | null;
    address: string | null;
};

export type LocalizedInfoApiResponse = {
    localizedInfo: LocalizedInfo | null;
};

export type UpsertLocalizedInfoParams = {
    generalInfoId: string;
    languageCode: string;
    data: LocalizedInfoFormData;
};

export type TranslatedRole = {
    id?: string;
    general_info_id?: string | null;
    language_code?: string | null;
    role_name: string;
};

export type RolesApiResponse = {
    roles: TranslatedRole[];
};

export type UpsertRoleParams = {
    id?: string;
    generalInfoId: string;
    languageCode: string;
    roleName: string;
};

export type Skill = {
    id: string;
    name: string;
    icon_url: string;
    category: string;
};

export type SkillsApiResponse = {
    skills: Skill[];
};

export type UpsertSkillParams = {
    id?: string;
    name: string;
    icon_url: string;
    category: string;
};
