import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>FlowLab - Simulador ENEM</title>
        <meta name="description" content="Simulador do ENEM com questões autênticas para sua preparação" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="ENEM, simulado, vestibular, educação, FlowLab" />
        <meta name="author" content="FlowLab" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flowlab-enem.vercel.app/" />
        <meta property="og:title" content="FlowLab - Simulador ENEM" />
        <meta property="og:description" content="Simulador do ENEM com questões autênticas para sua preparação" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="FlowLab - Simulador ENEM" />
        <meta property="twitter:description" content="Simulador do ENEM com questões autênticas para sua preparação" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}