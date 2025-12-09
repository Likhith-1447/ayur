-- Disable RLS temporarily and drop all policies
ALTER TABLE user_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_claims DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE health_analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all foreign key constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE user_stats DROP CONSTRAINT IF EXISTS user_stats_user_id_fkey;
ALTER TABLE daily_claims DROP CONSTRAINT IF EXISTS daily_claims_user_id_fkey;
ALTER TABLE user_activities DROP CONSTRAINT IF EXISTS user_activities_user_id_fkey;
ALTER TABLE achievements DROP CONSTRAINT IF EXISTS achievements_user_id_fkey;
ALTER TABLE health_alerts DROP CONSTRAINT IF EXISTS health_alerts_user_id_fkey;
ALTER TABLE health_analyses DROP CONSTRAINT IF EXISTS health_analyses_user_id_fkey;

-- Update user_id columns from uuid to text to support Clerk user IDs
ALTER TABLE user_stats ALTER COLUMN user_id TYPE text;
ALTER TABLE daily_claims ALTER COLUMN user_id TYPE text;
ALTER TABLE user_activities ALTER COLUMN user_id TYPE text;
ALTER TABLE achievements ALTER COLUMN user_id TYPE text;
ALTER TABLE health_alerts ALTER COLUMN user_id TYPE text;
ALTER TABLE health_analyses ALTER COLUMN user_id TYPE text;
ALTER TABLE profiles ALTER COLUMN id TYPE text;

-- Re-enable RLS with open policies (we'll handle user filtering in the application layer)
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (application will handle user filtering)
CREATE POLICY "Allow all operations" ON user_stats FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON daily_claims FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON user_activities FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON achievements FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON health_alerts FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON health_analyses FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON profiles FOR ALL USING (true);