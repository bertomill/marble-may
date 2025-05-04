import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Function to generate app ideas based on business details
export async function generateAppIdea(businessDetails: string) {
  const result = streamText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'system',
        content: `You are an expert app developer and business consultant. Generate detailed app ideas based on business descriptions. Focus on solving real business problems with creative, commercially viable solutions.`
      },
      {
        role: 'user',
        content: `The business details are: ${businessDetails}

Please generate a detailed app idea that addresses their needs. Include:
1. A catchy name for the app
2. A concise value proposition (1-2 sentences)
3. Key features (list 3-5)
4. Target audience
5. How it solves business problems
6. Potential monetization strategy`
      }
    ],
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}

export async function generateAppCode(appIdea: string, features: string[]) {
  const result = streamText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'system',
        content: `You are an expert app developer specializing in Next.js, React, and Tailwind CSS. Your task is to generate clean, well-structured, and modern code for web applications.`
      },
      {
        role: 'user',
        content: `Generate the code for a Next.js app with the following idea:
        
App Idea: ${appIdea}

Features to implement:
${features.map(feature => `- ${feature}`).join('\n')}

Please generate the following:
1. A structured file listing (which files need to be created)
2. The content for each file, showing the full code (React components, logic, styles)
3. Use Next.js 14 with the App Router
4. Use TypeScript for type safety
5. Use Tailwind CSS for styling
6. Include proper error handling and loading states
7. Follow best practices for accessibility and responsiveness
8. Keep the code clean, modular, and well-commented

Return the output as a JSON object with this structure:
{
  "files": {
    "filepath1": "code content",
    "filepath2": "code content",
    ...
  }
}`
      }
    ],
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
} 