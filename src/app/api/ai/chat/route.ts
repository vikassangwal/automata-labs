import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAIConfig, generateAIContent } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, postContent, postTitle, history } = body;

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
        // Try to find post ID by title if possible (rough match)
        let postId = null;
        if (postTitle) {
          const post = await prisma.blogPost.findFirst({ where: { title: postTitle } });
          if (post) postId = post.id;
        }

        await prisma.lead.create({
          data: { name: 'Chatbot Visitor', email, status: 'New', source: 'chatbot', postId }
        });
      }
    }

    // 2. Fetch AI Config
    const aiConfig = await getAIConfig();

    // 3. Define Context-Bound System Personality
    const systemPrompt = `You are a helpful blog assistant. You can ONLY answer questions based on the following blog post content. If the user asks anything unrelated to this blog post, politely decline and redirect them to the blog post topic.

Blog Post Title: ${postTitle || 'Blog Post'}
Blog Post Content: ${postContent ? postContent.substring(0, 4000) : 'No content provided.'}

Rules:
1. Only answer questions directly related to this blog post.
2. If asked about unrelated topics, say: "I can only help with questions about this blog post. Please ask something related to the post content."
3. Keep answers concise, helpful, and friendly.
4. Reference specific parts of the blog post when answering.
5. If the user provides an email address, thank them and tell them the team will be in touch shortly.`;

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
    
    let fallbackReply = "I am currently operating in demo mode. Please add an AI API key (OpenAI/Gemini/Claude) in the Admin Settings to unlock my full conversational abilities!";
    
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
      fallbackReply = `Hello! I'm the assistant for "${postTitle || 'this post'}". How can I help you understand this content better?`;
    } else if (emailMatch) {
      fallbackReply = "Thank you! I've securely passed your email to our team. An AI specialist will contact you shortly.";
    }

    return NextResponse.json({ reply: fallbackReply });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ reply: "I'm sorry, I'm experiencing some technical difficulties. Please try again later." });
  }
}
