CREATE TABLE IF NOT EXISTS general_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_url TEXT,
    schedule_link TEXT,
    email TEXT,
    created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE general_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view general info" ON general_info FOR SELECT USING (true);
CREATE POLICY "Only Admin can add general info" ON general_info
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only Admin can update general info" ON general_info
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only Admin can delete general info" ON general_info
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS supported_languages (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE
);

ALTER TABLE supported_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view supported languages" ON supported_languages FOR SELECT USING (true);
CREATE POLICY "Only Admin can add supported languages" ON supported_languages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only Admin can update supported languages" ON supported_languages
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only Admin can delete supported languages" ON supported_languages
    FOR DELETE USING (auth.role() = 'authenticated');

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

ALTER TABLE general_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view general translations" ON general_translations FOR SELECT USING (true);
CREATE POLICY "Only Admin can add general translations" ON general_translations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only Admin can update general translations" ON general_translations
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only Admin can delete general translations" ON general_translations
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS translated_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    general_info_id UUID REFERENCES general_info(id) ON DELETE CASCADE,
    language_code TEXT REFERENCES supported_languages(code) ON DELETE CASCADE,
    role_name TEXT NOT NULL
);

ALTER TABLE translated_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view translated roles" ON translated_roles FOR SELECT USING (true);
CREATE POLICY "Only Admin can add translated roles" ON translated_roles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only Admin can update translated roles" ON translated_roles
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only Admin can delete translated roles" ON translated_roles
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS social_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    general_info_id UUID REFERENCES general_info(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    display_name TEXT
);

ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social profiles" ON social_profiles FOR SELECT USING (true);
CREATE POLICY "Only Admin can add social profiles" ON social_profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only Admin can update social profiles" ON social_profiles
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only Admin can delete social profiles" ON social_profiles
    FOR DELETE USING (auth.role() = 'authenticated');