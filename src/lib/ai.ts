import { prisma } from '@/lib/prisma';

export type AIProvider = 'openai' | 'gemini' | 'anthropic' | 'deepseek';

interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

/**
 * Get AI configuration from SiteSettings or ApiKey table
 */
export async function getAIConfig(): Promise<AIConfig | null> {
  try {
    // First try SiteSettings
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    if (settings?.aiApiKey) {
      return {
        provider: settings.aiProvider as AIProvider,
        apiKey: settings.aiApiKey,
        model: settings.aiModel,
      };
    }
    
    // Fallback to ApiKey table
    const apiKey = await prisma.apiKey.findFirst({
      where: { 
        provider: { in: ['openai', 'google_ai', 'anthropic'] },
        isActive: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (apiKey) {
      const providerMap: Record<string, AIProvider> = {
        'openai': 'openai',
        'google_ai': 'gemini',
        'anthropic': 'anthropic'
      };
      return {
        provider: providerMap[apiKey.provider] || 'openai',
        apiKey: apiKey.apiKey,
        model: apiKey.provider === 'openai' ? 'gpt-4o-mini' : 
               apiKey.provider === 'google_ai' ? 'gemini-pro' : 'claude-3-haiku-20240307',
      };
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Call AI API to generate content
 */
export async function generateAIContent(
  config: AIConfig,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 2000
): Promise<string> {
  
  if (config.provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: maxTokens
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`OpenAI API error: ${data.error?.message || res.status}`);
    return data.choices?.[0]?.message?.content || '';
  }
  
  if (config.provider === 'gemini') {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }],
          generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 }
        })
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(`Gemini API error: ${data.error?.message || res.status}`);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
  
  if (config.provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Anthropic API error: ${data.error?.message || res.status}`);
    return data.content?.[0]?.text || '';
  }
  
  if (config.provider === 'deepseek') {
    // Check if the user mistakenly put an OpenRouter key in the DeepSeek field
    const isOpenRouterKey = config.apiKey.startsWith('sk-or-');
    const endpoint = isOpenRouterKey 
      ? 'https://openrouter.ai/api/v1/chat/completions' 
      : 'https://api.deepseek.com/chat/completions';
      
    const modelToUse = isOpenRouterKey 
      ? (config.model.includes('/') ? config.model : `deepseek/${config.model}`)
      : (config.model || 'deepseek-chat');

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        ...(isOpenRouterKey && {
          'HTTP-Referer': 'https://automata-labs.vercel.app',
          'X-Title': 'Automata Labs'
        })
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: maxTokens
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`DeepSeek API error: ${data.error?.message || JSON.stringify(data)}`);
    return data.choices?.[0]?.message?.content || '';
  }
  
  throw new Error(`Unsupported AI provider: ${config.provider}`);
}

/**
 * Helper to generate with default AI context
 */
export async function generateWithAI(prompt: string, customSystemPrompt?: string): Promise<string> {
  const config = await getAIConfig();
  if (!config) throw new Error('AI Provider not configured');
  
  const systemPrompt = customSystemPrompt || 'You are an expert copywriter and assistant.';
  return generateAIContent(config, systemPrompt, prompt);
}
