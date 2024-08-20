declare module 'openrouter' {
    export class OpenRouterClient {
      constructor(options: { apiKey: string; organization: string });
      completions: {
        create(options: { model: string; prompt: string }): Promise<{ data: { text: string } }>;
      };
    }
  }