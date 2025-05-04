'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PreviewStepProps {
  projectName: string;
  onPublish: () => void;
  isPublishing: boolean;
}

export default function PreviewStep({ 
  projectName, 
  onPublish, 
  isPublishing 
}: PreviewStepProps) {
  // In a real implementation, we would have:
  // 1. A way to view the generated files
  // 2. A sandbox preview of the app running
  // 3. Options to make adjustments
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Preview Your App</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-md overflow-hidden bg-white">
          <div className="bg-gray-100 p-2 border-b flex items-center">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="mx-auto text-sm text-gray-500">{projectName}</div>
          </div>
          <div className="h-96 flex items-center justify-center p-4">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">{projectName}</h3>
              <p className="text-gray-500">
                Your app preview would appear here in a real implementation.
              </p>
              <p className="text-sm text-gray-400">
                In a production version, this would display a live preview of your
                generated app using an iframe or embedded sandbox.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Export Code</Button>
        <Button 
          onClick={onPublish}
          disabled={isPublishing}
        >
          {isPublishing ? 'Publishing...' : 'Publish Your App'}
        </Button>
      </CardFooter>
    </Card>
  );
} 