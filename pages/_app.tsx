// pages/_app.tsx

import { SessionProvider } from 'next-auth/react'
import Header from '../components/header'
import RootLayout from '../app/layout'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
        <RootLayout>
            <Header />
            <Component {...pageProps} />
        </RootLayout>
    </SessionProvider>
    
  )
}

export default MyApp