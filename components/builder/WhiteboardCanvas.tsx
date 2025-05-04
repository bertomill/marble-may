'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

// Dynamically import Excalidraw with SSR disabled
const Excalidraw = dynamic(
  async () => {
    const { Excalidraw } = await import('@excalidraw/excalidraw');
    return Excalidraw;
  },
  { ssr: false }
);

type WhiteboardCanvasProps = {
  initialData?: any;
  onSave: (sceneData: any, imageData: string) => void;
  isGenerating?: boolean;
};

export default function WhiteboardCanvas({
  initialData,
  onSave,
  isGenerating = false,
}: WhiteboardCanvasProps) {
  const excalidrawRef = useRef<any>(null);
  const excalidrawWrapperRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Set up initial data when component mounts
  useEffect(() => {
    // Small delay to ensure Excalidraw is fully loaded
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady && initialData && excalidrawRef.current) {
      try {
        excalidrawRef.current.updateScene(initialData);
      } catch (err) {
        console.error("Error loading whiteboard data:", err);
      }
    }
  }, [isReady, initialData]);

  // Function to capture screenshot of the canvas
  const captureScreenshot = async () => {
    if (!excalidrawWrapperRef.current) {
      toast.error("Could not capture whiteboard. Please try again.");
      return null;
    }
    
    try {
      // Get PNG image as base64 string
      const dataUrl = await toPng(excalidrawWrapperRef.current, {
        backgroundColor: "#ffffff", // White background
        pixelRatio: 2 // Higher quality
      });
      
      return dataUrl;
    } catch (err) {
      console.error("Error capturing screenshot:", err);
      toast.error("Failed to capture whiteboard image");
      return null;
    }
  };

  // Handle saving the whiteboard data and screenshot
  const handleSave = async () => {
    if (!excalidrawRef.current) {
      toast.error("Whiteboard not ready. Please try again.");
      return;
    }
    
    // Get the current scene data (elements, appState, etc.)
    const sceneData = excalidrawRef.current.getSceneElements();
    
    // Capture screenshot
    const imageData = await captureScreenshot();
    
    if (sceneData && imageData) {
      onSave(sceneData, imageData);
    }
  };

  return (
    <div className="relative h-full w-full">
      <div 
        ref={excalidrawWrapperRef}
        className="h-full w-full overflow-hidden flex flex-col"
      >
        {/* Loading state */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Excalidraw component */}
        <div className="flex-1 h-full">
          {typeof window !== 'undefined' && (
            <Excalidraw
              initialData={initialData}
              zenModeEnabled={false}
              gridModeEnabled={true}
              theme="light"
              name="app-builder-canvas"
              excalidrawAPI={newApi => {
                excalidrawRef.current = newApi;
              }}
            />
          )}
        </div>
        
        {/* Action buttons */}
        <div className="absolute bottom-6 right-6 z-10">
          <Button 
            onClick={handleSave}
            disabled={isGenerating}
            size="lg"
            className="shadow-lg"
          >
            {isGenerating ? 'Generating...' : 'Save & Generate App Ideas'}
          </Button>
        </div>
      </div>
    </div>
  );
} 