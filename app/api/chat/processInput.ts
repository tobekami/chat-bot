// app/api/chat/processInput.ts
import fetch from 'node-fetch';
import { querySupabase } from '../../../lib/supabase';

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!;
const YOUR_SITE_URL = 'https://your-site-url.com';
const YOUR_SITE_NAME = 'Your Site Name';

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export default async function processInput(input: string, language: string): Promise<string> {
  let model = 'meta-llama/llama-3.1-8b-instruct';

  if (input.includes('translate') || input.includes('language')) {
    model = 'google/gemma-2-9b-it';
  } else if (input.length > 200) {
    model = 'microsoft/phi-3-medium-128k-instruct';
  }

  // Retrieve relevant context from Supabase
  // const relevantContext = await querySupabase(input);
  // console.log('Relevant context:', relevantContext);
  console.log('language:', language);
  // const contextString = relevantContext.join('\n');

  const systemPrompt = `You are a helpful assistant. Please respond in ${language}. If you're not sure about the language, respond in English. Use the following context to inform your response, but don't directly quote it unless necessary:`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": YOUR_SITE_URL,
      "X-Title": YOUR_SITE_NAME,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        {"role": "system", "content": systemPrompt},
        {"role": "user", "content": input},
      ],
    })
  });

  const data = await response.json() as OpenRouterResponse;
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from OpenRouter API');
  }
  
  return data.choices[0].message.content;
}