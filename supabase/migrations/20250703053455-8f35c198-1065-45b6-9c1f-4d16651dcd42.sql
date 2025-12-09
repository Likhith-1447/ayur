-- Explicitly drop all existing policies by name
DROP POLICY IF EXISTS "Users can view their own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can insert their own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON user_stats;

DROP POLICY IF EXISTS "Users can view their own daily claims" ON daily_claims;
DROP POLICY IF EXISTS "Users can insert their own daily claims" ON daily_claims;

DROP POLICY IF EXISTS "Users can view their own activities" ON user_activities;
DROP POLICY IF EXISTS "Users can insert their own activities" ON user_activities;

DROP POLICY IF EXISTS "Users can view their own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON achievements;

DROP POLICY IF EXISTS "Users can view their own health alerts" ON health_alerts;
DROP POLICY IF EXISTS "Users can insert their own health alerts" ON health_alerts;
DROP POLICY IF EXISTS "Users can update their own health alerts" ON health_alerts;
DROP POLICY IF EXISTS "Users can delete their own health alerts" ON health_alerts;

DROP POLICY IF EXISTS "Users can view their own health analyses" ON health_analyses;
DROP POLICY IF EXISTS "Users can insert their own health analyses" ON health_analyses;
DROP POLICY IF EXISTS "Users can update their own health analyses" ON health_analyses;
DROP POLICY IF EXISTS "Users can delete their own health analyses" ON health_analyses;

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

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

-- Create simple policies that allow all operations (application will handle user filtering)
CREATE POLICY "Allow all operations" ON user_stats FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON daily_claims FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON user_activities FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON achievements FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON health_alerts FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON health_analyses FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON profiles FOR ALL USING (true);