'use client'
import { useState } from 'react'
import Link from 'next/link'
import { expertos } from '@/lib/expertos'

const AREAS = ['Todos', 'Jurídico', 'Finanzas', 'Marketing digital', 'Emprendimiento']

function formatCOP(n) {
  return '$' + n.toLocaleString('es-CO') + ' COP'
}

export default function ExpertosPage() {
  const [area, setArea] = useState('Todos')
  const [modalExperto, setModalExperto] = useState(null)
  const [sesion, setSesion] = useState(30)
  const [form, setForm] = useState({ nombre: '', email: '', consulta: '' })
  const [step, setStep] = useState('form') // form | success
  const [loading, setLoading] = useState(false)

  const filtrados = area === 'Todos' ? expertos.filter(e => e.activo) : expertos.filter(e => e.activo && e.area === area)

  const openModal = (e) => { setModalExperto(e); setSesion(30); setForm({ nombre: '', email: '', consulta: '' }); setStep('form') }
  const closeModal = () => setModalExperto(null)

  const submitRequest = async () => {
    if (!form.nombre || !form.email || !form.consulta) return alert('Completa todos los campos.')
    setLoading(true)
    await fetch('https://formspree.io/f/mjglbaoz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        experto: modalExperto.nombre,
        area: modalExperto.area,
        sesion: sesion + ' minutos',
        tarifa: formatCOP(sesion === 30 ? modalExperto.tarifa30 : modalExperto.tarifa60),
        cliente_nombre: form.nombre,
        cliente_email: form.email,
        consulta: form.consulta,
        _subject: 'Nueva solicitud de sesión — ExpertHour'
      })
    })
    setLoading(false)
    setStep('success')
  }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--cream)', minHeight: '100vh' }}>
      {/* HEADER */}
      <header style={{ background: 'var(--ink)', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 500, color: '#fff', letterSpacing: '0.08em', textDecoration: 'none' }}>
          Expert<span style={{ color: 'var(--gold)' }}>Hour</span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="https://aguileracisf.typeform.com/to/cfr8AP9G" target="_blank" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 20px', border: '1px solid var(--gold)', color: 'var(--gold)', background: 'transparent', textDecoration: 'none' }}>Quiero ser experto</a>
          <Link href="/login" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 20px', border: '1px solid var(--gold)', color: 'var(--ink)', background: 'var(--gold)', textDecoration: 'none' }}>Ingresar</Link>
        </nav>
      </header>

      {/* FILTERS */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', height: '56px', gap: '4px', overflowX: 'auto' }}>
          {AREAS.map((a, i) => (
            <span key={a} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <span style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }}></span>}
              <button onClick={() => setArea(a)} style={{ fontSize: '13px', fontWeight: area === a ? 500 : 400, color: area === a ? 'var(--ink)' : 'var(--ink-faint)', background: 'none', border: 'none', borderBottom: area === a ? '2px solid var(--gold)' : '2px solid transparent', padding: '0 20px', height: '56px', cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: '-1px' }}>
                {a === 'Todos' ? 'Todos los expertos' : a}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* DIRECTORY */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 400 }}>Expertos disponibles</h2>
          <span style={{ fontSize: '13px', color: 'var(--ink-faint)' }}>{filtrados.length} {filtrados.length === 1 ? 'experto' : 'expertos'}</span>
        </div>

        {filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', marginBottom: '8px' }}>No hay expertos en esta área aún</p>
            <p style={{ fontSize: '14px', color: 'var(--ink-faint)' }}>Estamos incorporando más expertos. Vuelve pronto.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {filtrados.map(e => (
              <div key={e.id} onClick={() => openModal(e)} style={{ background: 'var(--white)', border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                  {e.foto ? (
                    <img src={e.foto} alt={e.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', color: 'var(--gold)' }}>
                      {e.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>{e.area}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 500, marginBottom: '6px' }}>{e.nombre}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-faint)', marginBottom: '12px' }}>{e.experiencia} de experiencia</div>
                  <div style={{ fontSize: '13px', fontWeight: 300, color: 'var(--ink-light)', lineHeight: 1.6, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.descripcion}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--ink-light)' }}>Desde <strong style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 500 }}>{formatCOP(e.tarifa30)}</strong></div>
                    <button onClick={(ev) => { ev.stopPropagation(); openModal(e) }} style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 20px', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                      Agendar sesión
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--ink)', padding: '40px', marginTop: '40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: '#fff' }}>Expert<span style={{ color: 'var(--gold)' }}>Hour</span> · Consultorías</div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>© 2025 ExpertHour · Bogotá, Colombia</p>
        </div>
      </footer>

      {/* MODAL */}
      {modalExperto && (
        <div onClick={(e) => e.target === e.currentTarget && closeModal()} style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,18,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--white)', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal header */}
            <div style={{ background: 'var(--ink)', padding: '28px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px' }}>{modalExperto.area}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 400, color: '#fff', marginBottom: '4px' }}>{modalExperto.nombre}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{modalExperto.experiencia} de experiencia</div>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            {step === 'form' ? (
              <>
                <div style={{ padding: '32px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '16px' }}>Elige tu tipo de sesión</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                    {[30, 60].map(mins => (
                      <div key={mins} onClick={() => setSesion(mins)} style={{ border: `1px solid ${sesion === mins ? 'var(--ink)' : 'var(--border)'}`, background: sesion === mins ? 'var(--cream)' : 'var(--white)', padding: '16px', cursor: 'pointer', position: 'relative' }}>
                        {sesion === mins && <span style={{ position: 'absolute', top: '8px', right: '10px', fontSize: '12px', color: 'var(--gold)' }}>✓</span>}
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 500, marginBottom: '4px' }}>{mins} min</div>
                        <div style={{ fontSize: '13px', color: 'var(--ink-light)' }}>{formatCOP(mins === 30 ? modalExperto.tarifa30 : modalExperto.tarifa60)}</div>
                      </div>
                    ))}
                  </div>

                  <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '16px' }}>Cuéntale al experto tu consulta</p>

                  {[
                    { label: 'Tu nombre completo *', id: 'nombre', type: 'text', placeholder: 'Ej. María Rodríguez' },
                    { label: 'Tu correo electrónico *', id: 'email', type: 'email', placeholder: 'tu@correo.com' },
                  ].map(f => (
                    <div key={f.id} style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '8px' }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={form[f.id]} onChange={e => setForm({ ...form, [f.id]: e.target.value })} style={{ width: '100%', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--ink)', background: 'var(--cream)', border: '1px solid var(--border)', padding: '12px 14px', outline: 'none' }} />
                    </div>
                  ))}

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '8px' }}>Describe tu consulta *</label>
                    <textarea placeholder="Cuéntale al experto qué necesitas resolver. Sé específico — esto le ayudará a prepararse y decidir si puede ayudarte." value={form.consulta} onChange={e => setForm({ ...form, consulta: e.target.value })} style={{ width: '100%', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--ink)', background: 'var(--cream)', border: '1px solid var(--border)', padding: '12px 14px', outline: 'none', minHeight: '120px', resize: 'none' }} />
                    <p style={{ fontSize: '11px', color: 'var(--ink-faint)', marginTop: '6px' }}>El experto revisará tu consulta antes de confirmar. Te contactaremos en menos de 24 horas.</p>
                  </div>
                </div>

                <div style={{ padding: '24px 32px 32px', borderTop: '1px solid var(--border)' }}>
                  <button onClick={submitRequest} disabled={loading} style={{ width: '100%', fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '16px', background: loading ? 'var(--ink-faint)' : 'var(--ink)', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                  <p style={{ fontSize: '11px', color: 'var(--ink-faint)', textAlign: 'center', marginTop: '12px', lineHeight: 1.5 }}>El pago se realiza solo cuando el experto acepta tu solicitud.</p>
                </div>
              </>
            ) : (
              <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', border: '1px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '22px' }}>✓</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 400, marginBottom: '12px' }}>¡Solicitud enviada!</h3>
                <p style={{ fontSize: '14px', fontWeight: 300, color: 'var(--ink-light)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 28px' }}>Tu consulta fue enviada a <strong>{modalExperto.nombre}</strong>. Ahora el proceso es simple:</p>
                <div style={{ textAlign: 'left', background: 'var(--cream)', border: '1px solid var(--border)', padding: '20px 24px', marginBottom: '24px' }}>
                  {[
                    'El experto revisa tu consulta y decide si puede ayudarte.',
                    'Si acepta, recibirás un correo con el link de pago y el link para agendar la sesión.',
                    'Pagas, agendas y tienes tu sesión. Sin más pasos.'
                  ].map((t, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < 2 ? '12px' : 0, fontSize: '13px', color: 'var(--ink-light)', lineHeight: 1.5 }}>
                      <div style={{ width: '20px', height: '20px', background: 'var(--ink)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, flexShrink: 0 }}>{i + 1}</div>
                      <div>{t}</div>
                    </div>
                  ))}
                </div>
                <button onClick={closeModal} style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '14px 32px', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer' }}>Entendido</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
