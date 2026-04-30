'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const ESTADOS = {
  pendiente: { label: 'Pendiente', color: '#F59E0B', bg: '#FEF3C7' },
  aceptada: { label: 'Aceptada', color: '#10B981', bg: '#D1FAE5' },
  rechazada: { label: 'Rechazada', color: '#EF4444', bg: '#FEE2E2' },
}

export default function DashboardExperto() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [solicitudes, setSolicitudes] = useState([])
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
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--ink)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)' }}>Cargando...</p>
    </div>
  )

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--ink)', minHeight: '100vh' }}>
      {/* HEADER */}
      <header style={{ padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 500, color: '#fff', letterSpacing: '0.08em', textDecoration: 'none' }}>
          Expert<span style={{ color: 'var(--gold)' }}>Hour</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{user?.user_metadata?.full_name || user?.email}</span>
          <button onClick={handleLogout} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>Salir</button>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 40px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>Panel de experto</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300, color: '#fff' }}>
            Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'experto'}.
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[
            ['0', 'Solicitudes pendientes'],
            ['0', 'Sesiones aceptadas'],
            ['$0', 'Ingresos este mes'],
          ].map(([val, label]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '24px' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 400, color: 'var(--gold)', marginBottom: '8px' }}>{val}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Solicitudes */}
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 400, color: '#fff', marginBottom: '24px' }}>Solicitudes recibidas</h2>

          {solicitudes.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '48px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Aún no tienes solicitudes</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Cuando un cliente solicite una sesión contigo, aparecerá aquí para que puedas aceptar o rechazar.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {solicitudes.map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 500, color: '#fff' }}>{s.cliente_nombre}</span>
                      <span style={{ fontSize: '11px', padding: '3px 10px', background: ESTADOS[s.estado]?.bg, color: ESTADOS[s.estado]?.color, fontWeight: 500 }}>{ESTADOS[s.estado]?.label}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', lineHeight: 1.6 }}>{s.consulta}</p>
                    <span style={{ fontSize: '11px', color: 'var(--gold)' }}>{s.sesion} · {s.tarifa}</span>
                  </div>
                  {s.estado === 'pendiente' && (
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 16px', background: 'var(--gold)', color: 'var(--ink)', border: 'none', cursor: 'pointer' }}>Aceptar</button>
                      <button style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 16px', background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>Rechazar</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info box */}
        <div style={{ background: 'rgba(184,160,106,0.08)', border: '1px solid rgba(184,160,106,0.2)', padding: '20px 24px', marginTop: '32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>¿Tienes dudas?</div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Escríbenos a <a href="mailto:expertos@experthour.co" style={{ color: 'var(--gold)', textDecoration: 'none' }}>expertos@experthour.co</a> para cualquier consulta sobre tus sesiones o tu perfil.
          </p>
        </div>
      </main>
    </div>
  )
}
