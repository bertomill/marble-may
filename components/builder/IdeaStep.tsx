'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface IdeaStepProps {
  appIdea: string;
  onAddFeature: (feature: string) => void;
  onRemoveFeature: (index: number) => void;
  features: string[];
  onProceed: () => void;
  isLoading: boolean;
}

export default function IdeaStep({ 
  appIdea, 
  onAddFeature, 
  onRemoveFeature, 
  features, 
  onProceed, 
  isLoading 
}: IdeaStepProps) {
  const [newFeature, setNewFeature] = useState('');

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onAddFeature(newFeature.trim());
      setNewFeature('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Your App Idea</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Generated App Idea</Label>
          <div className="p-4 border rounded-md bg-gray-50 whitespace-pre-line">
            {appIdea || 'Generating app idea...'}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="features">Add Features</Label>
          <div className="flex space-x-2">
            <Input 
              id="features"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Enter a feature"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
            />
            <Button onClick={handleAddFeature} type="button">Add</Button>
          </div>
        </div>

        <div>
          <Label>Feature List</Label>
          <div className="mt-2 space-y-2">
            {features.length === 0 ? (
              <p className="text-sm text-gray-500">
                Add at least one feature to continue
              </p>
            ) : (
              features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{feature}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveFeature(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onProceed}
          disabled={isLoading || features.length === 0}
          className="w-full"
        >
          {isLoading ? 'Building Your App...' : 'Build Your App'}
        </Button>
      </CardFooter>
    </Card>
  );
} 