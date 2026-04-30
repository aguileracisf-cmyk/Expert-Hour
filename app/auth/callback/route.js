import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      'https://ktyozwtzsjnrqadbthui.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0eW96d3R6c2pucnFhZGJ0aHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDg1NzgsImV4cCI6MjA5MzA4NDU3OH0.8HnAehelgr_uK1iVDaSF8kbBwQ5eyEgGwKwoYHqGMf8',
      { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/dashboard/cliente', request.url))
}
