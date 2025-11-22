import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://cfcqerxevbgrrajzucfm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY3FlcnhldmJncnJhanp1Y2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1ODk4NDksImV4cCI6MjA3OTE2NTg0OX0.fZZw7P30Bk54Mr8btXrRkkFQaWBWTeY2SHWT8FxeDBU'
export const supabase = createClient(supabaseUrl, supabaseKey)