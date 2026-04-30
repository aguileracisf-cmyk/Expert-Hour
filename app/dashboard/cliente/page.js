'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function DashboardCliente() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const sb = createClient()

  useEffect(() => {
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) window.location.href = '/login'
      else { setUser(user); setLoading(false) }
    })
  }, [])

  const handleLogout = async () => {
    await sb.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink-faint)' }}>Cargando...</p>
    </div>
  )

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--cream)', minHeight: '100vh' }}>
      {/* HEADER */}
      <header style={{ background: 'var(--ink)', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 500, color: '#fff', letterSpacing: '0.08em', textDecoration: 'none' }}>
          Expert<span style={{ color: 'var(--gold)' }}>Hour</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{user?.user_metadata?.full_name || user?.email}</span>
          <button onClick={handleLogout} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>Salir</button>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 40px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>Mi cuenta</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300 }}>
            Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'bienvenido'}.
          </h1>
        </div>

        {/* Quick action */}
        <div style={{ background: 'var(--ink)', padding: '32px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 400, color: '#fff', marginBottom: '8px' }}>¿Necesitas una asesoría?</h3>
            <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.6)' }}>Encuentra el experto que necesitas y envía tu consulta ahora mismo.</p>
          </div>
          <Link href="/expertos" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 24px', background: 'var(--gold)', color: 'var(--ink)', textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: '24px' }}>
            Ver expertos →
          </Link>
        </div>

        {/* Solicitudes */}
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 400, marginBottom: '24px' }}>Mis solicitudes</h2>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', padding: '48px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: 'var(--ink)', marginBottom: '8px' }}>Aún no tienes solicitudes</p>
            <p style={{ fontSize: '13px', color: 'var(--ink-faint)', marginBottom: '24px' }}>Cuando envíes una consulta a un experto, aparecerá aquí con su estado.</p>
            <Link href="/expertos" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 24px', background: 'var(--ink)', color: '#fff', textDecoration: 'none' }}>
              Buscar un experto
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
