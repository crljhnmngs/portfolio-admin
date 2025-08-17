-- CreateTable
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    category TEXT NOT NULL
);

-- AlterTable
ALTER TABLE skills
ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;