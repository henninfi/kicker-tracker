// pages/_app.tsx

import { SessionProvider } from 'next-auth/react'
import { FiefAuthProvider } from '@fief/fief/nextjs/react';
import Header from '../components/header'
import RootLayout from '../app/layout'
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FiefAuthProvider currentUserPath="/api/current-user"> 
        <RootLayout>
            <Header />
            <Component {...pageProps} />
        </RootLayout>
    </FiefAuthProvider> 
    
  )
}

export default MyApp