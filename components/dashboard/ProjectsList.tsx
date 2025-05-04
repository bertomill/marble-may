'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { doc, deleteDoc, Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Project } from '@/types';

interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDeleteProject = async (projectId?: string) => {
    if (!projectId) {
      toast.error('Project ID is missing');
      return;
    }

    if (!db) {
      toast.error('Database not initialized');
      return;
    }
    
    setDeleting(projectId);
    
    try {
      await deleteDoc(doc(db as Firestore, 'projects', projectId));
      toast.success('Project deleted successfully');
      // Force a refresh of the page
      window.location.reload();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'idea':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Idea
          </span>
        );
      case 'building':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Building
          </span>
        );
      case 'preview':
        return (
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
            Preview
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Published
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="mb-2 text-xl font-semibold">No projects yet</h2>
        <p className="mb-6 text-gray-500">
          Get started by creating your first app
        </p>
        <Link href="/builder">
          <Button>Create an App</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="truncate">{project.name}</CardTitle>
              {getStatusLabel(project.status)}
            </div>
            <CardDescription className="line-clamp-2">
              {project.app_idea || 'No description provided'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Features:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {project.features && project.features.length > 0 ? (
                    project.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {feature}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No features added</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            {project.status === 'published' ? (
              <Button
                variant="outline"
                onClick={() => window.open(project.published_url, '_blank')}
              >
                View Live
              </Button>
            ) : (
              <Link href={`/builder?project=${project.id}`}>
                <Button variant="outline">Continue</Button>
              </Link>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this project and all of its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={deleting === project.id}
                  >
                    {deleting === project.id ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 