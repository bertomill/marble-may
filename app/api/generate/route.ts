import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { messages, data, type } = await req.json();
    
    // Generate a system message based on the request type
    let systemMessage = '';
    
    if (type === 'idea') {
      const { businessDetails, whiteboardImage } = data;
      
      systemMessage = `You are an expert app consultant that helps businesses plan successful app ideas. 
      
      Based on the following business details:
      
      ${businessDetails}
      
      ${whiteboardImage ? 'The user has also attached a whiteboard sketch that shows their initial app concept. Analyze this image to understand their UI/UX goals.' : ''}
      
      Please provide a comprehensive app idea that meets these business needs. Focus on solving real problems for the target audience. 
      Include a name for the app and how it would work in detail.`;
    } else if (type === 'code') {
      const { appIdea, features } = data;
      
      systemMessage = `You are an expert web application developer that specializes in building modern, production-ready apps.
      
      Based on the following app idea:
      
      ${appIdea}
      
      And these requested features:
      
      ${features.join('\n')}
      
      Please generate the core code files needed for this application. Focus on creating a working prototype with clean, maintainable code. Include key components, utilities, and structure.
      
      Respond with a JSON object where keys are filenames and values are the file contents. Each file should be complete and runnable.`;
    } else {
      return new Response(JSON.stringify({ error: 'Invalid request type' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Prepare the messages array with the system message
    const messagesToSend = [
      { role: 'system', content: systemMessage },
      ...messages,
    ];
    
    // Add the whiteboard image as a content part if it exists
    if (type === 'idea' && data.whiteboardImage) {
      const lastUserMsgIndex = messagesToSend.findLastIndex(
        msg => msg.role === 'user'
      );
      
      if (lastUserMsgIndex !== -1) {
        messagesToSend[lastUserMsgIndex] = {
          role: 'user',
          content: [
            { type: 'text', text: messagesToSend[lastUserMsgIndex].content },
            {
              type: 'image_url',
              image_url: { url: data.whiteboardImage },
            },
          ],
        };
      }
    }
    
    // Create a completion stream using the OpenAI API
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      stream: true,
      messages: messagesToSend as any,
      max_tokens: 4000,
    });
    
    // Convert the stream to a readable stream that can be returned in a response
    const textEncoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(textEncoder.encode(text));
          }
        }
        controller.close();
      },
    });
    
    // Return a plain text stream response
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate content' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 