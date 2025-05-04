'use client';

import AppBuilder from '@/components/builder/AppBuilder';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function BuilderPage() {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">App Builder</h1>
        {user && <AppBuilder userId={user.uid} />}
      </div>
    </ProtectedRoute>
  );
} 