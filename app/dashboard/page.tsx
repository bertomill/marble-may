'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import type { Project } from '@/types';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProjects() {
      if (!user || !db) return;
      
      try {
        setLoading(true);
        
        // Create a query against the projects collection
        const projectsRef = collection(db, 'projects');
        const q = query(
          projectsRef,
          where('user_id', '==', user.uid),
          orderBy('created_at', 'desc')
        );
        
        // Execute the query
        const querySnapshot = await getDocs(q);
        
        // Map the results to our Project type
        const fetchedProjects: Project[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push({
            id: doc.id,
            ...doc.data()
          } as Project);
        });
        
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, [user, db]);
  
  // Sample template data (inspired by Mural's templates)
  const templates = [
    {
      id: 'template-1',
      title: 'Rapid mind mapping',
      description: 'Represent and organize ideas visually to find relationships',
      color: 'bg-red-500'
    },
    {
      id: 'template-2',
      title: 'Timeline',
      description: 'Summarize upcoming plans or share past accomplishments via a horizontal timeline',
      color: 'bg-emerald-500'
    },
    {
      id: 'template-3',
      title: 'Prioritization matrix',
      description: 'Collect ideas or tasks and rank their impact and feasibility',
      color: 'bg-blue-500'
    },
    {
      id: 'template-4',
      title: 'Brainstorm grid',
      description: 'Use the intersection of rows and columns to spark new ideas',
      color: 'bg-red-500'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="mb-6">
            <Link href="/builder" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center">
              <span className="mr-2">+</span> Create new app
            </Link>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-900">
              <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Starred
            </a>
          </nav>
          
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Workspace
            </h3>
            <div className="mt-2">
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Apps
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Templates
              </a>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : projects.length > 0 ? (
            <div>
              <h2 className="text-lg font-medium mb-4">Recently opened apps</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {projects.map((project) => (
                  <Link href={`/projects/${project.id}`} key={project.id} className="group">
                    <div className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md bg-white">
                      <div className="h-40 bg-gray-100 border-b border-gray-200 p-4 flex items-center justify-center">
                        <span className="text-gray-400">{project.name || "Untitled App"}</span>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 group-hover:text-emerald-600">
                          {project.name || "Untitled App"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Modified {new Date(project.updated_at?.toDate() || project.created_at.toDate()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <h2 className="text-xl font-semibold text-gray-900">No projects yet</h2>
              <p className="mt-2 text-gray-600">Get started by creating your first app</p>
              <div className="mt-6">
                <Link 
                  href="/builder" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Create an App
                </Link>
              </div>
            </div>
          )}
          
          {/* Templates Section (inspired by Mural) */}
          <div className="mt-12">
            <h2 className="text-lg font-medium mb-4">Template recommendations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className={`h-40 ${template.color} p-4 flex items-center justify-center text-white font-medium`}>
                    {template.title}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{template.title}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 