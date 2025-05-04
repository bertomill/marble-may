'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  return (
    <div className="min-h-screen">
      {/* Hero section with gradient background inspired by Mural */}
      <div className="bg-gradient-to-b from-emerald-500 to-emerald-400 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Go from ideas to <span className="text-emerald-900">action</span>
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-10">
            Marble is a visual collaboration platform that gives your teams an AI-powered, 
            interactive space to ideate, align, and execute on your business strategy.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-md text-lg transition-colors">
            Try it now
          </button>
        </div>
      </div>

      {/* Two-column layout for features and auth */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column - Features */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Build AI-Powered Apps for Your Business
            </h2>
            <p className="text-lg text-gray-600">
              Answer a few questions about your business, and let our AI generate 
              a fully functional web app tailored to your needs.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="ml-3 text-lg">Generate app ideas based on your business</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="ml-3 text-lg">AI builds the app with your chosen features</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="ml-3 text-lg">Preview your app before publishing</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="ml-3 text-lg">Publish and share with the world</span>
              </li>
            </ul>
          </div>
          
          {/* Right column - Auth Form */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <AuthForm />
          </div>
        </div>
      </div>

      {/* App Screenshot/Demo Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">See it in action</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our intuitive interface makes it easy to create and manage your AI applications
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Placeholder for app screenshot - would be replaced with actual Image component */}
            <div className="bg-gray-200 w-full h-96 flex items-center justify-center">
              <p className="text-gray-500 text-lg">App Interface Preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
