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

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <FiefAuthProvider currentUserPath="/api/current-user"> 
          <RootLayout>
              <Header />
              <Component {...pageProps} />
          </RootLayout>
      </FiefAuthProvider> 
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    
  )
}

export default MyApp