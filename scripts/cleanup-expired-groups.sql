-- Delete expired play groups (run daily via Supabase cron or manually)
delete from play_groups
where expires_at <= now();
