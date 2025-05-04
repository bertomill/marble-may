'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface BuildStepProps {
  generatedCode: string;
  isLoading: boolean;
  onProceed: () => void;
}

export default function BuildStep({ generatedCode, isLoading, onProceed }: BuildStepProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Building Your App</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] overflow-auto border rounded-md p-4 bg-gray-50">
          {isLoading ? (
            <div className="space-y-4">
              <p>Generating your app...</p>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm">
              {generatedCode || 'No code generated yet.'}
            </pre>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onProceed}
          disabled={isLoading || !generatedCode}
          className="w-full"
        >
          Preview Your App
        </Button>
      </CardFooter>
    </Card>
  );
} 