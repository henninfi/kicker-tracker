// pages/_app.tsx

import { SessionProvider } from 'next-auth/react'
import { FiefAuthProvider } from '@fief/fief/nextjs/react';
import Header from '../components/header'
import RootLayout from '../app/layout'
import type { AppProps } from 'next/app';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from "@propelauth/react";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider authUrl={process.env.NEXT_PUBLIC_AUTH_URL as string}>
          <RootLayout>
              <Header />
              <Component {...pageProps} />
          </RootLayout>
      </AuthProvider >
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    
  )
}

export default MyApp