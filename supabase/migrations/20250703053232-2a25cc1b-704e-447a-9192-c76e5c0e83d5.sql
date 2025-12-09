-- Update user_id columns from uuid to text to support Clerk user IDs
ALTER TABLE user_stats ALTER COLUMN user_id TYPE text;
ALTER TABLE daily_claims ALTER COLUMN user_id TYPE text;
ALTER TABLE user_activities ALTER COLUMN user_id TYPE text;
ALTER TABLE achievements ALTER COLUMN user_id TYPE text;
ALTER TABLE health_alerts ALTER COLUMN user_id TYPE text;
ALTER TABLE health_analyses ALTER COLUMN user_id TYPE text;

-- Update the profiles table to use text as well for consistency
ALTER TABLE profiles ALTER COLUMN id TYPE text;