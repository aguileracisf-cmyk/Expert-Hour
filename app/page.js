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

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

:root {
  --cream: #F5F0E8;
  --ink: #1A1612;
  --ink-light: #4A4540;
  --ink-faint: #8A8580;
  --gold: #B8A06A;
  --gold-light: #D4BC8A;
  --border: #E0D8CC;
  --white: #FFFFFF;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--ink);
}

.serif { font-family: 'Cormorant Garamond', serif; }

import './globals.css'

export const metadata = {
  title: 'ExpertHour — Consultorías',
  description: 'Asesoría legal, financiera o de negocio para personas y empresas — sin enredos, sin intermediarios y sin costos absurdos.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

'use client'
import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <div>
      {/* HEADER */}
      <header style={{background:'var(--ink)',padding:'0 40px',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontFamily:'Cormorant Garamond,serif',fontSize:'20px',fontWeight:500,color:'#fff',letterSpacing:'0.08em',textDecoration:'none'}}>
          Expert<span style={{color:'var(--gold)'}}>Hour</span>
        </Link>
        <nav style={{display:'flex',alignItems:'center',gap:'24px'}}>
          <a href="#como-funciona" style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',textDecoration:'none'}}>Cómo funciona</a>
          <a href="#areas" style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',textDecoration:'none'}}>Áreas</a>
          <a href="https://aguileracisf.typeform.com/to/cfr8AP9G" target="_blank" style={{fontSize:'12px',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',padding:'8px 20px',border:'1px solid var(--gold)',color:'var(--gold)',background:'transparent',textDecoration:'none'}}>
            Quiero ser experto
          </a>
          <Link href="/login" style={{fontSize:'12px',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',padding:'8px 20px',border:'1px solid var(--gold)',color:'var(--ink)',background:'var(--gold)',textDecoration:'none'}}>
            Ingresar
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section style={{maxWidth:'1200px',margin:'0 auto',padding:'80px 40px 60px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'60px',alignItems:'center'}}>
        <div>
          <p style={{fontSize:'11px',fontWeight:500,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'16px'}}>Consultorías on-demand</p>
          <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'52px',fontWeight:300,lineHeight:1.1,marginBottom:'20px'}}>
            El experto que<br />necesitas, <em style={{fontStyle:'italic',color:'var(--gold)'}}>cuando</em><br />lo necesitas.
          </h1>
          <p style={{fontSize:'15px',fontWeight:300,lineHeight:1.7,color:'var(--ink-light)',marginBottom:'36px',maxWidth:'480px'}}>
            Asesoría legal, financiera o de negocio para personas y empresas — sin enredos, sin intermediarios y sin costos absurdos. Resuelve tu duda en una sesión de 30 minutos o 1 hora con expertos reales y verificados.
          </p>
          <div style={{display:'flex',gap:'32px'}}>
            {[['30\'','Mínimo por sesión'],['4','Áreas de expertise'],['100%','Expertos verificados']].map(([num,label]) => (
              <div key={label}>
                <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:'32px',fontWeight:500,display:'block'}}>{num}</span>
                <span style={{fontSize:'11px',color:'var(--ink-faint)',letterSpacing:'0.06em',textTransform:'uppercase'}}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
          {[
            {area:'Jurídico',nombre:'Laura Q.',exp:'8 años',precio:'$100.000'},
            {area:'Finanzas',nombre:'Carlos M.',exp:'12 años',precio:'$80.000'},
            {area:'Marketing',nombre:'Andrea P.',exp:'6 años',precio:'$70.000'},
            {area:'Emprendimiento',nombre:'Juan S.',exp:'10 años',precio:'$90.000'},
          ].map((e,i) => (
            <div key={e.nombre} style={{background:'var(--white)',border:'1px solid var(--border)',padding:'20px',position:'relative',marginTop:i%2===1?'24px':i===2?'-24px':'0'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'var(--gold)'}}></div>
              <div style={{fontSize:'10px',fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'8px'}}>{e.area}</div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'16px',fontWeight:500,marginBottom:'4px'}}>{e.nombre}</div>
              <div style={{fontSize:'12px',color:'var(--ink-faint)',marginBottom:'12px'}}>{e.exp} de experiencia</div>
              <div style={{fontSize:'13px',fontWeight:500}}>Desde {e.precio} COP</div>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" style={{background:'var(--ink)',padding:'80px 40px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <p style={{fontSize:'11px',fontWeight:500,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'16px',textAlign:'center'}}>El proceso</p>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'40px',fontWeight:300,color:'#fff',textAlign:'center',marginBottom:'56px'}}>¿Cómo funciona?</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'32px'}}>
            {[
              ['1','Elige tu experto','Navega el directorio, filtra por área y encuentra al profesional que mejor se ajusta a tu consulta.'],
              ['2','Describe tu consulta','Cuéntale al experto qué necesitas resolver. Él revisa tu caso antes de confirmar.'],
              ['3','Recibe confirmación','Si el experto acepta, recibes el link de pago y el link para agendar tu sesión.'],
              ['4','Ten tu sesión','Pagas, agendas y te conectas por videollamada. Sin burocracia ni costos adicionales.'],
            ].map(([n,t,d]) => (
              <div key={n} style={{textAlign:'center'}}>
                <div style={{width:'56px',height:'56px',border:'1px solid var(--gold)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontFamily:'Cormorant Garamond,serif',fontSize:'22px',color:'var(--gold)'}}>{n}</div>
                <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'20px',fontWeight:400,color:'#fff',marginBottom:'12px'}}>{t}</h3>
                <p style={{fontSize:'14px',fontWeight:300,color:'rgba(255,255,255,0.6)',lineHeight:1.7}}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTORIO PREVIEW */}
      <section id="areas" style={{maxWidth:'1200px',margin:'0 auto',padding:'80px 40px'}}>
        <p style={{fontSize:'11px',fontWeight:500,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'16px',textAlign:'center'}}>Expertos disponibles</p>
        <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'40px',fontWeight:300,textAlign:'center',marginBottom:'48px'}}>Encuentra tu experto</h2>
        <div style={{textAlign:'center'}}>
          <Link href="/expertos" style={{display:'inline-block',fontSize:'12px',fontWeight:500,letterSpacing:'0.12em',textTransform:'uppercase',padding:'16px 40px',background:'var(--ink)',color:'#fff',textDecoration:'none',transition:'background 0.2s'}}>
            Ver todos los expertos →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'var(--ink)',padding:'40px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'18px',fontWeight:400,color:'#fff',letterSpacing:'0.08em'}}>
            Expert<span style={{color:'var(--gold)'}}>Hour</span> · Consultorías
          </div>
          <p style={{fontSize:'12px',color:'rgba(255,255,255,0.3)'}}>© 2025 ExpertHour · Bogotá, Colombia · experthour.co</p>
        </div>
      </footer>
    </div>
  )
}

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
