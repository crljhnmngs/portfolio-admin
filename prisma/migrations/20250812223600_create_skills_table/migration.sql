CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    category TEXT NOT NULL
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);