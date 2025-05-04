'use client';

import AppBuilder from '@/components/builder/AppBuilder';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function BuilderPage() {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h1 className="text-xl font-semibold">App Builder</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Adding template...</span>
            <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md">
              Save
            </button>
          </div>
        </div>
        
        {/* Full height builder without padding for immersive experience */}
        {user && <AppBuilder userId={user.uid} />}
      </div>
    </ProtectedRoute>
  );
} 