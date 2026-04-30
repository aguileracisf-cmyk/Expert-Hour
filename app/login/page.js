'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [tab, setTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const sb = createClient()

  const handleLogin = async () => {
    setError('')
    if (!form.email || !form.password) return setError('Completa todos los campos.')
    setLoading(true)
    const { data, error: err } = await sb.auth.signInWithPassword({ email: form.email, password: form.password })
    if (err) {
      setError(err.message.includes('Invalid login credentials') ? 'Correo o contraseña incorrectos.' : err.message.includes('Email not confirmed') ? 'Verifica tu correo antes de ingresar.' : err.message)
      setLoading(false)
    } else {
      // Check if user is an expert
      const { data: expert } = await sb.from('expertos').select('id').eq('user_id', data.user.id).single()
      window.location.href = expert ? '/dashboard/experto' : '/dashboard/cliente'
    }
  }

  const handleRegister = async () => {
    setError('')
    setSuccess('')
    if (!form.name || !form.email || !form.password) return setError('Completa todos los campos.')
    if (form.password.length < 8) return setError('La contraseña debe tener mínimo 8 caracteres.')
    setLoading(true)
    const { error: err } = await sb.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } }
    })
    setLoading(false)
    if (err) setError(err.message)
    else setSuccess('¡Cuenta creada! Revisa tu correo para verificar tu cuenta.')
  }

  const handleGoogle = async () => {
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  const inputStyle = { width: '100%', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--ink)', background: 'var(--white)', border: '1px solid var(--border)', padding: '13px 16px', outline: 'none' }
  const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '8px' }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'var(--ink)', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 500, color: '#fff', letterSpacing: '0.08em', textDecoration: 'none' }}>
          Expert<span style={{ color: 'var(--gold)' }}>Hour</span>
        </Link>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px' }}>Bienvenido</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300, color: 'var(--ink)', lineHeight: 1.1, marginBottom: '36px' }}>Accede a tu<br />cuenta</h1>

          {/* TABS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); setSuccess('') }} style={{ fontSize: '13px', fontWeight: tab === t ? 500 : 400, color: tab === t ? 'var(--ink)' : 'var(--ink-faint)', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent', padding: '12px 0', cursor: 'pointer', marginBottom: '-1px' }}>
                {t === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </button>
            ))}
          </div>

          {error && <div style={{ color: '#C0392B', fontSize: '13px', marginBottom: '16px', padding: '10px 14px', background: '#fdf2f2', border: '1px solid #f5c6c6' }}>{error}</div>}
          {success && <div style={{ color: '#27AE60', fontSize: '13px', marginBottom: '16px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #a7f3d0' }}>{success}</div>}

          {/* LOGIN */}
          {tab === 'login' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Correo electrónico</label>
                <input type="email" style={inputStyle} placeholder="tu@correo.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Contraseña</label>
                  <a href="#" style={{ fontSize: '11px', color: 'var(--ink-faint)', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
                </div>
                <input type="password" style={inputStyle} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
              <button onClick={handleLogin} disabled={loading} style={{ width: '100%', fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '16px', background: loading ? 'var(--ink-faint)' : 'var(--ink)', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </div>
          )}

          {/* REGISTER */}
          {tab === 'register' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Nombre completo</label>
                <input type="text" style={inputStyle} placeholder="Tu nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Correo electrónico</label>
                <input type="email" style={inputStyle} placeholder="tu@correo.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Contraseña</label>
                <input type="password" style={inputStyle} placeholder="Mínimo 8 caracteres" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleRegister()} />
              </div>
              <button onClick={handleRegister} disabled={loading} style={{ width: '100%', fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '16px', background: loading ? 'var(--ink-faint)' : 'var(--ink)', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: 'var(--ink-faint)', lineHeight: 1.6 }}>
                Al registrarte aceptas nuestros <a href="#" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Términos de uso</a> y <a href="#" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Política de privacidad</a>
              </p>
            </div>
          )}

          {/* GOOGLE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            <span style={{ fontSize: '11px', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>o</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          </div>
          <button onClick={handleGoogle} style={{ width: '100%', fontSize: '13px', fontWeight: 400, padding: '13px 16px', background: 'var(--white)', color: 'var(--ink)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.52V5.45H1.83a8 8 0 0 0 0 7.1l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.72c1.22 0 2.31.42 3.17 1.25l2.37-2.37A8 8 0 0 0 1.83 5.45L4.5 7.52a4.77 4.77 0 0 1 4.48-2.8z"/></svg>
            {tab === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}
          </button>
        </div>
      </main>

      <footer style={{ padding: '24px 40px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>© 2025 ExpertHour · Bogotá, Colombia</p>
      </footer>
    </div>
  )
}
