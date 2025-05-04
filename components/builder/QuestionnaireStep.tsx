'use client';

import { useState } from 'react';
import WhiteboardCanvas from './WhiteboardCanvas';
import AppDetailsPanel from './AppDetailsPanel';
import type { Project } from '@/types';

export default function QuestionnaireStep({
  onSubmit,
  isLoading
}: {
  onSubmit: (projectName: string, businessDetails: string, sketchData: string, imageData: string) => void;
  isLoading: boolean;
}) {
  const [projectName, setProjectName] = useState('');
  const [businessDetails, setBusinessDetails] = useState('');
  const [whiteboardData, setWhiteboardData] = useState<any>(null);

  const handleSave = (sceneData: any, imageData: string) => {
    // Convert scene data to string for storage
    const sketchData = JSON.stringify(sceneData);
    
    // Call parent submit function with all the data
    onSubmit(projectName, businessDetails, sketchData, imageData);
  };

  // Create a partial project object for the details panel
  const projectData: Partial<Project> = {
    name: projectName,
    business_details: businessDetails,
    features: []
  };

  // Handler for project updates from the details panel
  const handleProjectUpdate = (updates: Partial<Project>) => {
    if (updates.name !== undefined) setProjectName(updates.name);
    if (updates.business_details !== undefined) setBusinessDetails(updates.business_details);
  };

  return (
    <div className="relative h-[calc(100vh-14rem)] md:h-[calc(100vh-12rem)] w-full">
      {/* Main whiteboard canvas */}
      <WhiteboardCanvas
        initialData={whiteboardData}
        onSave={handleSave}
        isGenerating={isLoading}
      />
      
      {/* App details panel in top right */}
      <div className="absolute top-4 right-4 z-10 w-full max-w-md">
        <AppDetailsPanel
          project={projectData}
          onUpdate={handleProjectUpdate}
          onClose={() => {}} // Not used here but required by props
          isOpen={true}
        />
      </div>
    </div>
  );
} 