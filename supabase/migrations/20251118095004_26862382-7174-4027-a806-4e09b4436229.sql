-- Fix RLS policies for user_stats table
DROP POLICY IF EXISTS "Users can view their own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can insert their own stats" ON user_stats;

-- Allow users to insert their own stats
CREATE POLICY "Users can insert their own stats"
ON user_stats
FOR INSERT
WITH CHECK (true);

-- Allow users to view their own stats
CREATE POLICY "Users can view their own stats"
ON user_stats
FOR SELECT
USING (true);

-- Allow users to update their own stats
CREATE POLICY "Users can update their own stats"
ON user_stats
FOR UPDATE
USING (true);

-- Fix RLS policies for daily_claims table
DROP POLICY IF EXISTS "Users can view their own claims" ON daily_claims;
DROP POLICY IF EXISTS "Users can insert their own claims" ON daily_claims;

CREATE POLICY "Users can view their own claims"
ON daily_claims
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own claims"
ON daily_claims
FOR INSERT
WITH CHECK (true);

-- Fix RLS policies for user_activities table
DROP POLICY IF EXISTS "Users can view their own activities" ON user_activities;
DROP POLICY IF EXISTS "Users can insert their own activities" ON user_activities;

CREATE POLICY "Users can view their own activities"
ON user_activities
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own activities"
ON user_activities
FOR INSERT
WITH CHECK (true);

-- Fix RLS policies for achievements table
DROP POLICY IF EXISTS "Users can view their own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON achievements;

CREATE POLICY "Users can view their own achievements"
ON achievements
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own achievements"
ON achievements
FOR INSERT
WITH CHECK (true);

-- Fix RLS policies for health_analyses table
DROP POLICY IF EXISTS "Users can view their own analyses" ON health_analyses;
DROP POLICY IF EXISTS "Users can insert their own analyses" ON health_analyses;

CREATE POLICY "Users can view their own analyses"
ON health_analyses
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own analyses"
ON health_analyses
FOR INSERT
WITH CHECK (true);