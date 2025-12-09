-- Drop foreign key constraints first
ALTER TABLE user_stats DROP CONSTRAINT IF EXISTS user_stats_user_id_fkey;
ALTER TABLE daily_claims DROP CONSTRAINT IF EXISTS daily_claims_user_id_fkey;
ALTER TABLE user_activities DROP CONSTRAINT IF EXISTS user_activities_user_id_fkey;
ALTER TABLE achievements DROP CONSTRAINT IF EXISTS achievements_user_id_fkey;
ALTER TABLE health_alerts DROP CONSTRAINT IF EXISTS health_alerts_user_id_fkey;
ALTER TABLE health_analyses DROP CONSTRAINT IF EXISTS health_analyses_user_id_fkey;

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

-- Recreate RLS policies with text-based user_id but without foreign key references since we're using Clerk
CREATE POLICY "Users can view their own stats" ON user_stats FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can insert their own stats" ON user_stats FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can update their own stats" ON user_stats FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own daily claims" ON daily_claims FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can insert their own daily claims" ON daily_claims FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own activities" ON user_activities FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can insert their own activities" ON user_activities FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own achievements" ON achievements FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can insert their own achievements" ON achievements FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own health alerts" ON health_alerts FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can insert their own health alerts" ON health_alerts FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can update their own health alerts" ON health_alerts FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can delete their own health alerts" ON health_alerts FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own health analyses" ON health_analyses FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can insert their own health analyses" ON health_analyses FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can update their own health analyses" ON health_analyses FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can delete their own health analyses" ON health_analyses FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (id = current_setting('request.jwt.claims', true)::json->>'sub');