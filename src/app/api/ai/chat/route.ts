import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAIConfig, generateAIContent } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 1. Check if the user shared an email address in this message
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emailMatch = message.match(emailRegex);

    if (emailMatch) {
      const email = emailMatch[0];
      
      // Try to save to CRM if not already exists
      const existing = await prisma.lead.findFirst({ where: { email } });
      if (!existing) {
        await prisma.lead.create({
          data: { name: 'Chatbot Visitor', email, status: 'New', source: 'chatbot' }
        });
      }
    }

    // 2. Fetch AI Config
    const aiConfig = await getAIConfig();
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    const siteName = settings?.siteName || 'Automata Labs';

    // 3. Define Context-Bound System Personality
    const systemPrompt = `You are a helpful AI Automation Consultant for ${siteName}.
Your goal is to answer questions about AI automation, lead generation, and our agency services. 
If the user seems interested in working with us, try to ask for their email address so our team can follow up.

Rules:
1. Keep answers concise, professional, and friendly.
2. If asked about unrelated topics, politely pivot back to AI automation and business scaling.
3. Highlight that we specialize in building AI agents, automated workflows, and CRM integrations.
4. If the user provides an email address, thank them and tell them the team will be in touch shortly.`;

    if (aiConfig) {
      // Format history into a string prompt for simpler unified generate function
      let formattedHistory = '';
      if (Array.isArray(history) && history.length > 0) {
        formattedHistory = history.map((msg: any) => `${msg.role === 'ai' ? 'Assistant' : 'User'}: ${msg.content}`).join('\n') + '\nUser: ' + message;
      } else {
        formattedHistory = `User: ${message}`;
      }

      const reply = await generateAIContent(aiConfig, systemPrompt, formattedHistory, 300);
      return NextResponse.json({ reply });
    }

    // 4. Intelligent Fallback (if no AI key or API fails)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate typing
    
    let fallbackReply = "I am currently operating in demo mode. Please check your API keys or credits in the Admin Settings.";
    
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
      fallbackReply = `Hello! I'm the AI assistant for ${siteName}. Are you looking to automate your business workflows or generate more leads?`;
    } else if (emailMatch) {
      fallbackReply = "Thank you! I've securely passed your email to our CRM. An AI specialist will contact you shortly.";
    }

    return NextResponse.json({ reply: fallbackReply });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ reply: "I'm sorry, I'm experiencing some technical difficulties. Please try again later." });
  }
}
