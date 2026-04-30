import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://ktyozwtzsjnrqadbthui.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0eW96d3R6c2pucnFhZGJ0aHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDg1NzgsImV4cCI6MjA5MzA4NDU3OH0.8HnAehelgr_uK1iVDaSF8kbBwQ5eyEgGwKwoYHqGMf8'
  )
}
