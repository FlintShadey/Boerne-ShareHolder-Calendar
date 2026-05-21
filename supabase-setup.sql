-- Time Tribe Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create the user_availability table
CREATE TABLE IF NOT EXISTS user_availability (
    id BIGSERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    selected_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_name, selected_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_availability_user_name 
    ON user_availability(user_name);

CREATE INDEX IF NOT EXISTS idx_user_availability_selected_date 
    ON user_availability(selected_date);

CREATE INDEX IF NOT EXISTS idx_user_availability_composite 
    ON user_availability(user_name, selected_date);

-- Enable Row Level Security (RLS)
ALTER TABLE user_availability ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all operations on user_availability" ON user_availability;

-- Create policy to allow all operations (public access)
CREATE POLICY "Allow all operations on user_availability"
    ON user_availability
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Enable real-time updates
-- Note: This might fail if the table is already added or publication doesn't exist
-- You can ignore the error if it says "relation already exists in publication"
DO $$
BEGIN
    -- Try to add the table to the realtime publication
    ALTER PUBLICATION supabase_realtime ADD TABLE user_availability;
EXCEPTION
    WHEN duplicate_object THEN
        -- Table already added to publication, this is fine
        RAISE NOTICE 'Table already exists in publication - this is OK';
    WHEN undefined_object THEN
        -- Publication doesn't exist, need to enable it in Supabase dashboard
        RAISE NOTICE 'Publication not found - enable Realtime in Supabase Dashboard > Database > Replication';
END $$;

-- Verify the setup
SELECT 
    'Table created successfully' as status,
    COUNT(*) as row_count 
FROM user_availability;
