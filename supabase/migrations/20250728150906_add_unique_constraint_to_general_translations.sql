ALTER TABLE general_translations
ADD CONSTRAINT unique_general_info_language
UNIQUE (general_info_id, language_code);