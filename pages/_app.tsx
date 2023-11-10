// pages/_app.tsx

import { SessionProvider } from 'next-auth/react'
import Header from '../components/header'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
      
    </SessionProvider>
    
  )
}

export default MyApp