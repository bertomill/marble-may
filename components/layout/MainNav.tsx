'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/">
            <span className="text-xl font-bold">Marble-May</span>
          </Link>
          
          {user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium ${
                  pathname === '/dashboard' ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/builder" 
                className={`text-sm font-medium ${
                  pathname.startsWith('/builder') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                App Builder
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            <Link href="/">
              <Button variant="outline">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 