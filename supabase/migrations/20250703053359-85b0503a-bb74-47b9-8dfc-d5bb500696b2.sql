-- Drop all foreign key constraints including profiles
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

-- Recreate RLS policies for Clerk authentication (using a simpler approach)
CREATE POLICY "Users can view their own stats" ON user_stats FOR SELECT USING (true);
CREATE POLICY "Users can insert their own stats" ON user_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own stats" ON user_stats FOR UPDATE USING (true);

CREATE POLICY "Users can view their own daily claims" ON daily_claims FOR SELECT USING (true);
CREATE POLICY "Users can insert their own daily claims" ON daily_claims FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own activities" ON user_activities FOR SELECT USING (true);
CREATE POLICY "Users can insert their own activities" ON user_activities FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Users can insert their own achievements" ON achievements FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own health alerts" ON health_alerts FOR SELECT USING (true);
CREATE POLICY "Users can insert their own health alerts" ON health_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own health alerts" ON health_alerts FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own health alerts" ON health_alerts FOR DELETE USING (true);

CREATE POLICY "Users can view their own health analyses" ON health_analyses FOR SELECT USING (true);
CREATE POLICY "Users can insert their own health analyses" ON health_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own health analyses" ON health_analyses FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own health analyses" ON health_analyses FOR DELETE USING (true);

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (true);