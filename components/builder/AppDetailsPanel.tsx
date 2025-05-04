'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

type AppDetailsPanelProps = {
  projectName: string;
  businessDetails: string;
  onProjectNameChange: (name: string) => void;
  onBusinessDetailsChange: (details: string) => void;
};

export default function AppDetailsPanel({
  projectName,
  businessDetails,
  onProjectNameChange,
  onBusinessDetailsChange
}: AppDetailsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="shadow-lg w-full max-w-md bg-white/95 backdrop-blur">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">App Details</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleExpand} 
          className="h-8 w-8 p-0"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Project Name
              </label>
              <Input
                value={projectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
                placeholder="My Amazing App"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Business Details
              </label>
              <Textarea
                value={businessDetails}
                onChange={(e) => onBusinessDetailsChange(e.target.value)}
                placeholder="Describe your business needs and target customers..."
                rows={4}
                className="w-full"
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-600 mb-2 font-medium">Tips:</p>
              <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                <li>Describe your target customers</li>
                <li>Explain what problems you solve</li>
                <li>Sketch your UI ideas on the canvas</li>
                <li>Add key features or requirements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
} 