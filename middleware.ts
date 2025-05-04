import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // For Firebase auth with client-side SDK, we don't need to do 
  // authentication checks in middleware since we're using the 
  // AuthProvider context and route protection in individual components
  
  // Instead, we'll just ensure our public routes are accessible
  // and protected routes will be handled by the components
  
  // Return the request as-is
  return NextResponse.next();
}

// Apply this middleware to routes that might need processing
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 