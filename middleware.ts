import type { NextRequest } from 'next/server';

import { fiefAuth } from './fief';  

const authMiddleware = fiefAuth.middleware([  
  {
    matcher: '/application:path*',  
    parameters: {},
  },
  {
    matcher: '/my_sessions:path*',  
    parameters: {},
  },
  {
    matcher: '/castles/:path*',  
    parameters: {
      permissions: ['castles:read'],  
    },
  },
]);

export async function middleware(request: NextRequest) {  
  return authMiddleware(request);  
};
