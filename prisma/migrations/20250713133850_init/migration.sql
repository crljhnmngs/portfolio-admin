-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: general_info
CREATE TABLE IF NOT EXISTS general_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_url TEXT,
    schedule_link TEXT,
    email TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Table: supported_languages
CREATE TABLE IF NOT EXISTS supported_languages (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE
);

-- Table: general_translations
CREATE TABLE IF NOT EXISTS general_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    general_info_id UUID REFERENCES general_info(id) ON DELETE CASCADE,
    language_code TEXT REFERENCES supported_languages(code) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    current_company TEXT,
    "current_role" TEXT,
    about_me TEXT,
    address TEXT
);

ALTER TABLE general_translations
ADD CONSTRAINT unique_general_info_language
UNIQUE (general_info_id, language_code);

-- Table: translated_roles
CREATE TABLE IF NOT EXISTS translated_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    general_info_id UUID REFERENCES general_info(id) ON DELETE CASCADE,
    language_code TEXT REFERENCES supported_languages(code) ON DELETE CASCADE,
    role_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
);

-- Table: social_profiles
CREATE TABLE IF NOT EXISTS social_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    general_info_id UUID REFERENCES general_info(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    display_name TEXT
);
