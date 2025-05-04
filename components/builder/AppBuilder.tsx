'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useChat } from '@ai-sdk/react';
import { toast } from 'sonner';
import { doc, addDoc, updateDoc, collection, serverTimestamp, Firestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AppDetailsPanel from './AppDetailsPanel';
import type { Project } from '@/types';

// Dynamic import of Excalidraw component 
const Excalidraw = dynamic(
  async () => {
    const { Excalidraw } = await import('@excalidraw/excalidraw');
    return Excalidraw;
  },
  { ssr: false }
);

// Define the tools for our drawing interface
type Tool = 'select' | 'text' | 'rectangle' | 'diamond' | 'ellipse' | 'line' | 'arrow' | 'freedraw' | 'image' | 'eraser' | 'pan';

export default function AppBuilder({ userId }: { userId: string }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const excalidrawRef = useRef<any>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>('select');
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [project, setProject] = useState<Partial<Project>>({
    user_id: userId,
    name: '',
    business_details: '',
    app_idea: '',
    features: [],
    status: 'idea',
    sketch_data: '',
    whiteboard_image: '',
  });

  // AI Chat for idea generation
  const { append: appendIdea, isLoading: isIdeaLoading } = useChat({
    api: '/api/generate',
    body: {
      type: 'idea',
      data: { businessDetails: project.business_details }
    },
    onFinish: async (message) => {
      // Update the project with the generated idea
      const updatedProject = {
        ...project,
        app_idea: message.content,
        status: 'idea' as const,
      };
      setProject(updatedProject);
      
      // Save to Firestore if we have a project ID
      if (project.id) {
        await saveProject(updatedProject);
      }
    }
  });

  // Helper function to save project to Firestore
  const saveProject = async (projectData: Partial<Project>) => {
    if (!db) {
      toast.error('Database connection not available');
      return;
    }
    
    try {
      if (projectData.id) {
        // Update existing project
        const projectRef = doc(db as Firestore, 'projects', projectData.id);
        await updateDoc(projectRef, {
          ...projectData,
          updated_at: serverTimestamp()
        });
      } else {
        // Add a new project
        const projectsCollection = collection(db as Firestore, 'projects');
        const projectRef = await addDoc(projectsCollection, {
          ...projectData,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
        
        // Update local state with the project ID
        setProject({
          ...projectData,
          id: projectRef.id
        });
      }
      
      toast.success('Project saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save project.');
    }
  };

  // Function to handle tool selection
  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    
    // Apply tool selection to Excalidraw if available
    if (excalidrawRef.current) {
      if (tool === 'pan') {
        excalidrawRef.current.setAppState({ viewModeEnabled: true });
      } else {
        excalidrawRef.current.setAppState({ 
          viewModeEnabled: false,
          currentItemType: mapToolToExcalidraw(tool),
        });
      }
    }
  };
  
  // Maps our tool names to Excalidraw tool types
  const mapToolToExcalidraw = (tool: Tool): string => {
    switch (tool) {
      case 'select': return 'selection';
      case 'rectangle': return 'rectangle';
      case 'diamond': return 'diamond';
      case 'ellipse': return 'ellipse';
      case 'arrow': return 'arrow';
      case 'line': return 'line';
      case 'text': return 'text';
      case 'freedraw': return 'freedraw';
      case 'eraser': return 'eraser';
      case 'image': return 'image';
      default: return 'selection';
    }
  };

  // Save the project 
  const handleSave = async () => {
    if (!project.name) {
      toast.error('Please add a project name in the details panel.');
      setIsDetailsOpen(true);
      return;
    }
    
    if (excalidrawRef.current) {
      // Get the current elements and app state
      const sceneElements = excalidrawRef.current.getSceneElements();
      const appState = excalidrawRef.current.getAppState();
      
      // Save as a JSON string in the project
      const sketchData = JSON.stringify({
        elements: sceneElements,
        appState: appState,
      });
      
      // Save to our state
      const updatedProject = {
        ...project,
        sketch_data: sketchData,
      };
      
      setProject(updatedProject);
      await saveProject(updatedProject);
    } else {
      // Just save the existing project data
      await saveProject(project);
    }
  };

  // Generate app idea
  const handleGenerateIdea = async () => {
    if (!project.business_details) {
      toast.error('Please add business details in the details panel.');
      setIsDetailsOpen(true);
      return;
    }
    
    appendIdea(
      { role: 'user', content: project.business_details },
      { 
        body: {
          type: 'idea',
          data: { 
            businessDetails: project.business_details,
            whiteboardImage: project.whiteboard_image
          }
        }
      }
    );
  };

  // Handle app name and description updates
  const handleProjectUpdate = (updates: Partial<Project>) => {
    setProject({
      ...project,
      ...updates
    });
  };
  
  // Handle loading saved data
  const loadSavedData = () => {
    if (project.sketch_data && excalidrawRef.current) {
      try {
        const savedData = JSON.parse(project.sketch_data);
        excalidrawRef.current.updateScene(savedData);
      } catch (error) {
        console.error('Error loading sketch data:', error);
      }
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Toolbar - similar to Mural */}
      <div className="w-14 bg-gray-900 text-white flex flex-col items-center py-2">
        <ToolButton 
          icon="cursor" 
          label="Select" 
          isActive={selectedTool === 'select'} 
          onClick={() => handleToolSelect('select')} 
        />
        <ToolButton 
          icon="text" 
          label="Text" 
          isActive={selectedTool === 'text'} 
          onClick={() => handleToolSelect('text')} 
        />
        <ToolButton 
          icon="square" 
          label="Rectangle" 
          isActive={selectedTool === 'rectangle'} 
          onClick={() => handleToolSelect('rectangle')} 
        />
        <ToolButton 
          icon="circle" 
          label="Ellipse" 
          isActive={selectedTool === 'ellipse'} 
          onClick={() => handleToolSelect('ellipse')} 
        />
        <ToolButton 
          icon="diamond" 
          label="Diamond" 
          isActive={selectedTool === 'diamond'} 
          onClick={() => handleToolSelect('diamond')} 
        />
        <ToolButton 
          icon="arrow" 
          label="Arrow" 
          isActive={selectedTool === 'arrow'} 
          onClick={() => handleToolSelect('arrow')} 
        />
        <ToolButton 
          icon="line" 
          label="Line" 
          isActive={selectedTool === 'line'} 
          onClick={() => handleToolSelect('line')} 
        />
        <ToolButton 
          icon="draw" 
          label="Draw" 
          isActive={selectedTool === 'freedraw'} 
          onClick={() => handleToolSelect('freedraw')} 
        />
        <ToolButton 
          icon="eraser" 
          label="Eraser" 
          isActive={selectedTool === 'eraser'} 
          onClick={() => handleToolSelect('eraser')} 
        />
        <div className="mt-auto">
          <ToolButton 
            icon="hand" 
            label="Pan" 
            isActive={selectedTool === 'pan'} 
            onClick={() => handleToolSelect('pan')} 
          />
        </div>
      </div>
      
      {/* Main Canvas Area */}
      <div className="flex-1 relative bg-gray-100 overflow-hidden">
        <div ref={canvasRef} className="w-full h-full">
          {typeof window !== 'undefined' && (
            <Excalidraw
              excalidrawAPI={(api) => {
                excalidrawRef.current = api;
                loadSavedData();
              }}
              initialData={project.sketch_data ? JSON.parse(project.sketch_data) : undefined}
              gridModeEnabled={true}
              zenModeEnabled={false}
              viewModeEnabled={false}
              theme="light"
            />
          )}

          {/* Generate idea button and loading overlay */}
          {isIdeaLoading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                <p>Generating ideas based on your business description...</p>
              </div>
            </div>
          )}
          
          {/* AI-generated app idea display */}
          {project.app_idea && !isIdeaLoading && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 max-w-md z-10">
              <div className="bg-yellow-100 p-4 rounded-md shadow-md">
                <h3 className="font-bold text-black mb-2">AI-Generated App Idea:</h3>
                <p className="text-gray-800 text-sm">{project.app_idea}</p>
              </div>
            </div>
          )}
          
          {/* Generate button if no idea yet */}
          {!project.app_idea && !isIdeaLoading && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
              <button 
                onClick={handleGenerateIdea}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                disabled={!project.business_details}
              >
                Generate App Idea with AI
              </button>
            </div>
          )}
          
          {/* Save button */}
          <div className="absolute top-4 right-4 z-10 mr-4">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-lg"
            >
              Save
            </button>
          </div>
        </div>
        
        {/* Details Panel - using the AppDetailsPanel component */}
        <AppDetailsPanel
          project={project}
          onUpdate={handleProjectUpdate}
          onClose={() => setIsDetailsOpen(false)}
          isOpen={isDetailsOpen}
        />
        
        {/* Toggle Details Panel Button */}
        {!isDetailsOpen && (
          <button 
            onClick={() => setIsDetailsOpen(true)}
            className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md"
          >
            ◀ Details
          </button>
        )}
      </div>
    </div>
  );
}

// Tool Button Component
function ToolButton({ 
  icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: string; 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2 mb-2 rounded-md w-10 h-10 flex items-center justify-center relative group ${
        isActive ? 'bg-gray-700' : 'hover:bg-gray-800'
      }`}
      title={label}
    >
      {/* Icons as simple text for now - in a real implementation, use proper SVG icons */}
      {icon === 'cursor' && '✥'}
      {icon === 'text' && 'T'}
      {icon === 'square' && '□'}
      {icon === 'circle' && '○'}
      {icon === 'diamond' && '◇'}
      {icon === 'arrow' && '↗'}
      {icon === 'line' && '—'}
      {icon === 'draw' && '✎'}
      {icon === 'eraser' && '⌫'}
      {icon === 'hand' && '✋'}
      
      {/* Tooltip */}
      <span className="absolute left-full ml-2 p-1 bg-gray-800 text-xs text-white rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-10">
        {label}
      </span>
    </button>
  );
} 