-- Drop all RLS policies that depend on user_id columns
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

-- Update user_id columns from uuid to text to support Clerk user IDs
ALTER TABLE user_stats ALTER COLUMN user_id TYPE text;
ALTER TABLE daily_claims ALTER COLUMN user_id TYPE text;
ALTER TABLE user_activities ALTER COLUMN user_id TYPE text;
ALTER TABLE achievements ALTER COLUMN user_id TYPE text;
ALTER TABLE health_alerts ALTER COLUMN user_id TYPE text;
ALTER TABLE health_analyses ALTER COLUMN user_id TYPE text;
ALTER TABLE profiles ALTER COLUMN id TYPE text;

-- Recreate RLS policies with text-based user_id
CREATE POLICY "Users can view their own stats" ON user_stats FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own stats" ON user_stats FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own daily claims" ON daily_claims FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own daily claims" ON daily_claims FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own activities" ON user_activities FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own activities" ON user_activities FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own achievements" ON achievements FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own health alerts" ON health_alerts FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own health alerts" ON health_alerts FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own health alerts" ON health_alerts FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own health alerts" ON health_alerts FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own health analyses" ON health_analyses FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own health analyses" ON health_analyses FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own health analyses" ON health_analyses FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own health analyses" ON health_analyses FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid()::text = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid()::text = id);