'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { doc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuestionnaireStep from './QuestionnaireStep';
import IdeaStep from './IdeaStep';
import BuildStep from './BuildStep';
import PreviewStep from './PreviewStep';
import type { Project } from '@/types';

type BuilderStep = 'questionnaire' | 'idea' | 'build' | 'preview';

export default function AppBuilder({ userId }: { userId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<BuilderStep>('questionnaire');
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
  const [isPublishing, setIsPublishing] = useState(false);

  // AI Chat for idea generation
  const { append: appendIdea, isLoading: isIdeaLoading } = useChat({
    api: '/api/generate',
    body: {
      type: 'idea',
      data: { businessDetails: project.business_details }
    },
    streamMode: 'text',
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
      
      // Move to the next step
      setStep('idea');
    }
  });

  // AI Chat for code generation
  const { messages: codeMessages, append: appendCode, isLoading: isCodeLoading } = useChat({
    api: '/api/generate',
    body: {
      type: 'code',
      data: { 
        appIdea: project.app_idea,
        features: project.features 
      }
    },
    streamMode: 'text',
    onFinish: async (message) => {
      // Try to parse the message content as JSON or treat as plain text
      let generatedCode = message.content;
      try {
        // If the response is JSON with a "files" property
        const parsed = JSON.parse(message.content);
        if (parsed.files) {
          generatedCode = JSON.stringify(parsed.files, null, 2);
        }
      } catch {
        // If not valid JSON, keep as is (the AI might not return valid JSON)
        console.log('Code parsing error');
      }

      // Parse generated code and ensure it's in the correct format
      let parsedCode: Record<string, string> = {};
      try {
        parsedCode = JSON.parse(generatedCode);
      } catch {
        // If parsing fails, store it as a single file
        parsedCode = { 'app.js': generatedCode };
      }
      
      // Update the project with the generated code
      const updatedProject = {
        ...project,
        generated_code: parsedCode,
        status: 'preview' as const,
      };
      setProject(updatedProject);
      
      // Save to Firestore
      if (project.id) {
        await saveProject(updatedProject);
      }
      
      // Move to the preview step
      setStep('preview');
    }
  });

  // Handle questionnaire submission
  const handleQuestionnaireSubmit = async (
    projectName: string, 
    businessDetails: string,
    sketchData: string,
    whiteboardImage: string
  ) => {
    try {
      // Create or update the project in Firestore
      const updatedProject = {
        ...project,
        name: projectName,
        business_details: businessDetails,
        sketch_data: sketchData,
        whiteboard_image: whiteboardImage,
      };
      
      // Add a new document with a generated id
      const projectRef = await addDoc(collection(db, 'projects'), {
        ...updatedProject,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      // Update local state with the created project (including its ID)
      setProject({
        ...updatedProject,
        id: projectRef.id
      });
      
      // Start the idea generation with proper business details and whiteboard image in the body
      appendIdea(
        { role: 'user', content: businessDetails },
        { 
          body: {
            type: 'idea',
            data: { 
              businessDetails: businessDetails,
              whiteboardImage: whiteboardImage
            }
          }
        }
      );
    } catch (error: unknown) {
      console.error('Project creation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to save project: ' + errorMessage);
    }
  };

  // Handle adding a feature
  const handleAddFeature = async (feature: string) => {
    const updatedFeatures = [...(project.features || []), feature];
    const updatedProject = { ...project, features: updatedFeatures };
    setProject(updatedProject);
    
    // Save to Firestore if we have a project ID
    if (project.id) {
      await saveProject(updatedProject);
    }
  };

  // Handle removing a feature
  const handleRemoveFeature = async (index: number) => {
    const updatedFeatures = [...(project.features || [])];
    updatedFeatures.splice(index, 1);
    const updatedProject = { ...project, features: updatedFeatures };
    setProject(updatedProject);
    
    // Save to Firestore if we have a project ID
    if (project.id) {
      await saveProject(updatedProject);
    }
  };

  // Handle proceeding to build step
  const handleProceedToBuild = async () => {
    const updatedProject = { ...project, status: 'building' as const };
    setProject(updatedProject);
    setStep('build');
    
    // Save to Firestore if we have a project ID
    if (project.id) {
      await saveProject(updatedProject);
    }
    
    // Start code generation
    appendCode({ 
      role: 'user', 
      content: `App Idea: ${project.app_idea}, Features: ${project.features?.join(', ')}` 
    });
  };

  // Handle proceeding to preview step
  const handleProceedToPreview = async () => {
    const updatedProject = { ...project, status: 'preview' as const };
    setProject(updatedProject);
    setStep('preview');
    
    // Save to Firestore if we have a project ID
    if (project.id) {
      await saveProject(updatedProject);
    }
  };

  // Handle app publication
  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // In a real implementation, this would:
      // 1. Package up the generated code
      // 2. Deploy to a hosting provider (e.g., Vercel)
      // 3. Return a deployed URL
      
      // For now, we'll just simulate a delay and update the status
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedProject = { 
        ...project, 
        status: 'published' as const,
        published_url: `https://example.com/${project.name?.toLowerCase().replace(/\s+/g, '-')}`,
      };
      
      setProject(updatedProject);
      
      // Save to Firestore if we have a project ID
      if (project.id) {
        await saveProject(updatedProject);
      }
      
      toast.success('App successfully published!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish app.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Helper function to save project to Firestore
  const saveProject = async (projectData: Partial<Project>) => {
    try {
      if (!projectData.id) return;
      
      const projectRef = doc(db, 'projects', projectData.id);
      await updateDoc(projectRef, {
        ...projectData,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save project.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs value={step} onValueChange={value => setStep(value as BuilderStep)} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="questionnaire" disabled={step !== 'questionnaire'}>
            1. Questionnaire
          </TabsTrigger>
          <TabsTrigger 
            value="idea"
            disabled={step === 'questionnaire'}
          >
            2. App Idea
          </TabsTrigger>
          <TabsTrigger 
            value="build"
            disabled={step === 'questionnaire' || step === 'idea'}
          >
            3. Build
          </TabsTrigger>
          <TabsTrigger 
            value="preview"
            disabled={step === 'questionnaire' || step === 'idea' || step === 'build'}
          >
            4. Preview
          </TabsTrigger>
        </TabsList>

        <div className="my-6">
          <TabsContent value="questionnaire">
            <QuestionnaireStep
              onSubmit={handleQuestionnaireSubmit}
              isLoading={isIdeaLoading}
            />
          </TabsContent>
          
          <TabsContent value="idea">
            <IdeaStep
              appIdea={project.app_idea || ''}
              onAddFeature={handleAddFeature}
              onRemoveFeature={handleRemoveFeature}
              features={project.features || []}
              onProceed={handleProceedToBuild}
              isLoading={isCodeLoading}
            />
          </TabsContent>
          
          <TabsContent value="build">
            <BuildStep
              generatedCode={codeMessages.length > 0 ? codeMessages[codeMessages.length - 1].content : ''}
              isLoading={isCodeLoading}
              onProceed={handleProceedToPreview}
            />
          </TabsContent>
          
          <TabsContent value="preview">
            <PreviewStep
              projectName={project.name || 'Untitled Project'}
              onPublish={handlePublish}
              isPublishing={isPublishing}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 