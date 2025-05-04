'use client';

import { useState } from 'react';
import WhiteboardCanvas from './WhiteboardCanvas';
import AppDetailsPanel from './AppDetailsPanel';

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
          projectName={projectName}
          businessDetails={businessDetails}
          onProjectNameChange={setProjectName}
          onBusinessDetailsChange={setBusinessDetails}
        />
      </div>
    </div>
  );
} 