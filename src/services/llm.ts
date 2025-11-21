// LLM Service Layer - Integrates OpenAI, Anthropic, and Google Gemini

import type { Env, LLMResponse, LLMProvider } from '../types';

export class LLMService {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  /**
   * Call OpenAI GPT models
   */
  async callOpenAI(prompt: string, systemPrompt?: string, model: string = 'gpt-4o-mini'): Promise<LLMResponse> {
    const messages: any[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.8,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      tokens: data.usage?.total_tokens,
    };
  }

  /**
   * Call Anthropic Claude models
   */
  async callAnthropic(prompt: string, systemPrompt?: string, model: string = 'claude-3-5-sonnet-20241022'): Promise<LLMResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        temperature: 0.8,
        system: systemPrompt || 'You are a helpful assistant.',
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${error}`);
    }

    const data = await response.json();
    
    return {
      content: data.content[0].text,
      model: data.model,
      tokens: data.usage?.input_tokens + data.usage?.output_tokens,
    };
  }

  /**
   * Call Google Gemini models
   */
  async callGoogle(prompt: string, systemPrompt?: string, model: string = 'gemini-2.0-flash-exp'): Promise<LLMResponse> {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: fullPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4000,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google API error: ${error}`);
    }

    const data = await response.json();
    
    return {
      content: data.candidates[0].content.parts[0].text,
      model,
      tokens: data.usageMetadata?.totalTokenCount,
    };
  }

  /**
   * Unified call method with provider selection
   */
  async call(
    prompt: string,
    systemPrompt?: string,
    provider: LLMProvider = 'openai',
    model?: string
  ): Promise<LLMResponse> {
    switch (provider) {
      case 'openai':
        return this.callOpenAI(prompt, systemPrompt, model);
      case 'anthropic':
        return this.callAnthropic(prompt, systemPrompt, model);
      case 'google':
        return this.callGoogle(prompt, systemPrompt, model);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}
