'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <header style={{background:'var(--ink)',padding:'0 40px',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontFamily:'Cormorant Garamond,serif',fontSize:'20px',fontWeight:500,color:'#fff',letterSpacing:'0.08em',textDecoration:'none'}}>
          Expert<span style={{color:'var(--gold)'}}>Hour</span>
        </Link>
        <nav style={{display:'flex',alignItems:'center',gap:'24px'}}>
          <a href="#como-funciona" style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',textDecoration:'none'}}>Cómo funciona</a>
          <a href="#areas" style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',textDecoration:'none'}}>Áreas</a>
          <a href="https://aguileracisf.typeform.com/to/cfr8AP9G" target="_blank" style={{fontSize:'12px',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',padding:'8px 20px',border:'1px solid var(--gold)',color:'var(--gold)',background:'transparent',textDecoration:'none'}}>Quiero ser experto</a>
          <Link href="/login" style={{fontSize:'12px',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',padding:'8px 20px',border:'1px solid var(--gold)',color:'var(--ink)',background:'var(--gold)',textDecoration:'none'}}>Ingresar</Link>
        </nav>
      </header>
      <section style={{maxWidth:'1200px',margin:'0 auto',padding:'80px 40px 60px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'60px',alignItems:'center'}}>
        <div>
          <p style={{fontSize:'11px',fontWeight:500,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'16px'}}>Consultorías on-demand</p>
          <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'52px',fontWeight:300,lineHeight:1.1,marginBottom:'20px'}}>El experto que<br />necesitas, <em style={{fontStyle:'italic',color:'var(--gold)'}}>cuando</em><br />lo necesitas.</h1>
          <p style={{fontSize:'15px',fontWeight:300,lineHeight:1.7,color:'var(--ink-light)',marginBottom:'36px',maxWidth:'480px'}}>Asesoría legal, financiera o de negocio para personas y empresas — sin enredos, sin intermediarios y sin costos absurdos. Resuelve tu duda en una sesión de 30 minutos o 1 hora con expertos reales y verificados.</p>
          <div style={{display:'flex',gap:'32px'}}>
            {[["30'","Mínimo por sesión"],["4","Áreas de expertise"],["100%","Expertos verificados"]].map(([num,label]) => (
              <div key={label}>
                <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:'32px',fontWeight:500,display:'block'}}>{num}</span>
                <span style={{fontSize:'11px',color:'var(--ink-faint)',letterSpacing:'0.06em',textTransform:'uppercase'}}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
          {[{area:'Jurídico',nombre:'Laura Q.',exp:'8 años',precio:'$100.000'},{area:'Finanzas',nombre:'Carlos M.',exp:'12 años',precio:'$80.000'},{area:'Marketing',nombre:'Andrea P.',exp:'6 años',precio:'$70.000'},{area:'Emprendimiento',nombre:'Juan S.',exp:'10 años',precio:'$90.000'}].map((e,i) => (
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
      <section id="como-funciona" style={{background:'var(--ink)',padding:'80px 40px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <p style={{fontSize:'11px',fontWeight:500,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'16px',textAlign:'center'}}>El proceso</p>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'40px',fontWeight:300,color:'#fff',textAlign:'center',marginBottom:'56px'}}>¿Cómo funciona?</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'32px'}}>
            {[['1','Elige tu experto','Navega el directorio, filtra por área y encuentra al profesional que mejor se ajusta a tu consulta.'],['2','Describe tu consulta','Cuéntale al experto qué necesitas resolver. Él revisa tu caso antes de confirmar.'],['3','Recibe confirmación','Si el experto acepta, recibes el link de pago y el link para agendar tu sesión.'],['4','Ten tu sesión','Pagas, agendas y te conectas por videollamada. Sin burocracia ni costos adicionales.']].map(([n,t,d]) => (
              <div key={n} style={{textAlign:'center'}}>
                <div style={{width:'56px',height:'56px',border:'1px solid var(--gold)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontFamily:'Cormorant Garamond,serif',fontSize:'22px',color:'var(--gold)'}}>{n}</div>
                <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'20px',fontWeight:400,color:'#fff',marginBottom:'12px'}}>{t}</h3>
                <p style={{fontSize:'14px',fontWeight:300,color:'rgba(255,255,255,0.6)',lineHeight:1.7}}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="areas" style={{maxWidth:'1200px',margin:'0 auto',padding:'80px 40px'}}>
        <p style={{fontSize:'11px',fontWeight:500,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'16px',textAlign:'center'}}>Expertos disponibles</p>
        <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'40px',fontWeight:300,textAlign:'center',marginBottom:'48px'}}>Encuentra tu experto</h2>
        <div style={{textAlign:'center'}}>
          <Link href="/expertos" style={{display:'inline-block',fontSize:'12px',fontWeight:500,letterSpacing:'0.12em',textTransform:'uppercase',padding:'16px 40px',background:'var(--ink)',color:'#fff',textDecoration:'none'}}>Ver todos los expertos →</Link>
        </div>
      </section>
      <footer style={{background:'var(--ink)',padding:'40px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'18px',fontWeight:400,color:'#fff',letterSpacing:'0.08em'}}>Expert<span style={{color:'var(--gold)'}}>Hour</span> · Consultorías</div>
          <p style={{fontSize:'12px',color:'rgba(255,255,255,0.3)'}}>© 2025 ExpertHour · Bogotá, Colombia · experthour.co</p>
        </div>
      </footer>
    </div>
  )
}
