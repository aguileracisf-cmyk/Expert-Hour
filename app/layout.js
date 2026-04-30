import './globals.css'

export const metadata = {
  title: 'ExpertHour — Consultorías',
  description: 'Asesoría legal, financiera o de negocio para personas y empresas.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
