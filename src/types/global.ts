import { LocalizedInfoFormData } from '@/utils/validation/localizedInfoSchema';
import { ExperienceFormData } from '@/utils/validation/experienceSchema';

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

export type Project = {
    id?: string;
    description: string;
    created_at?: string;
    tech?: string[];
};

export type SubItem = {
    id?: string;
    position: string;
    setup: string;
    start_date: string;
    end_date: string;
    projects: Project[];
};

export type Experience = {
    id: string;
    company: string;
    role: string;
    start_date: string;
    end_date: string;
    logo: string;
    link: string;
    description: string;
    tech: string[];
    sub_items?: SubItem[];
};

export type UpsertExperienceParams = {
    id: string;
    languageCode: string;
    data: ExperienceFormData;
};

export type ExperiencesApiResponse = {
    experiences: Experience[];
};

export type EducationFormData = {
    school: string;
    track: string;
    course: string;
    start_date: string;
    end_date: string;
    logo_url?: string;
    tech: string[];
};

export type UpsertEducationParams = {
    id?: string;
    languageCode: string;
    data: EducationFormData;
};

export type Education = {
    id: string;
    school: string;
    track: string;
    course: string;
    start_date: string;
    end_date: string;
    logo_url?: string;
    language_code: string;
    tech: string[];
    created_at?: Date;
};

export type EducationsApiResponse = {
    educations: Education[];
};

type Links = {
    github?: string;
    live?: string;
};

export type Projects = {
    id: string;
    name: string;
    image_url: string;
    about: string;
    tech: string[];
    date: string;
    new?: boolean;
    dev?: boolean;
    links: Links;
    language_code: string;
    created_at?: Date;
};

export type UpsertProjectParams = {
    id?: string;
    name: string;
    image_url: string;
    about: string;
    date: string;
    github?: string;
    live?: string;
    new?: boolean;
    dev?: boolean;
    language_code: string;
    tech: string[];
};

export type ProjectsApiResponse = {
    projects: Projects[];
};
