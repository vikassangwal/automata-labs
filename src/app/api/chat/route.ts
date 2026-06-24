import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiKey } from '@/lib/getApiKey';
import { eventEmitter } from '@/lib/eventEmitter';

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
        const lead = await prisma.lead.create({
          data: { name: 'Chatbot Visitor', email, status: 'New', source: 'chatbot' }
        });
        // Emit real-time alert!
        eventEmitter.emit('new-lead', lead);
      }
    }

    // 2. Define System Personality
    const systemPrompt = `You are "Automata Assistant", the official AI representative for "Automata Labs". 
Automata Labs builds enterprise AI automation, CRM systems, AI chatbots, and intelligent outreach hubs.
Keep your answers brief, friendly, and highly professional. 
If the user asks about pricing or custom projects, ask them to provide their email address so our team can reach out.
If the user provides an email address, thank them and tell them the team will be in touch shortly.`;

    // 3. Format Conversation History
    const conversation = (history || [])
      .map((msg: any) => `${msg.role === 'ai' ? 'Assistant' : 'User'}: ${msg.content}`)
      .join('\n');
    
    const fullPrompt = `Conversation History:\n${conversation}\n\nUser: ${message}\nAssistant:`;

    // 4. Generate AI Response
    try {
      const { generateWithAI } = await import('@/lib/ai');
      const reply = await generateWithAI(fullPrompt, systemPrompt);
      return NextResponse.json({ reply });
    } catch (apiError: any) {
      console.error('AI API Error:', apiError);
      
      // Intelligent Fallback (if no API key or API fails due to credits)
      let fallbackReply = "I am currently operating in demo mode. Please check your API keys or credits in the Admin Settings.";
      
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
        fallbackReply = "Hello! Welcome to Automata Labs. How can I help you automate your business today?";
      } else if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
        fallbackReply = "Our enterprise AI solutions are custom-built for your needs. Could you share your email address so our team can provide an accurate quote?";
      } else if (emailMatch) {
        fallbackReply = "Thank you! I've securely passed your email to our team. An AI specialist will contact you shortly.";
      }

      return NextResponse.json({ reply: fallbackReply });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ reply: "I'm sorry, I'm experiencing some technical difficulties. Please try again later." });
  }
}
