import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiKey } from '@/lib/getApiKey';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, leadName, leadCompany, leadEmail, websiteFlaws, customPrompt } = body;

    if (!leadName || !leadEmail) {
      return NextResponse.json({ error: 'Lead name and email are required' }, { status: 400 });
    }

    // Fetch OpenAI key from the admin's API Key Center
    const openaiKey = await getApiKey('openai');

    // Build the prompt for the AI
    const systemPrompt = `You are a professional sales outreach specialist for "Automata Labs", an enterprise AI automation agency. 
Your job is to draft a highly personalized, professional outreach email to a potential client.
The email should be friendly but authoritative, highlighting how Automata Labs can solve their specific problems.
Keep the email concise (under 200 words), professional, and end with a clear call-to-action.
Write in English. Do not use markdown formatting in the email body.`;

    const userPrompt = `Draft a personalized outreach email for this lead:
- Name: ${leadName}
- Company: ${leadCompany || 'Unknown'}
- Email: ${leadEmail}
${websiteFlaws ? `\nTheir website has these specific flaws/issues that we found:\n${websiteFlaws}\n\nMention these flaws tactfully in the email and explain how Automata Labs can fix them.` : ''}
${customPrompt ? `\nAdditional instructions: ${customPrompt}` : ''}

Generate:
1. A compelling subject line
2. The email body

Format your response as JSON: {"subject": "...", "body": "..."}`;

    let subject = '';
    let emailBody = '';

    if (openaiKey) {
      // Use real OpenAI API
      const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const content = aiData.choices?.[0]?.message?.content || '';
        try {
          // Try to parse JSON response
          const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsed = JSON.parse(cleaned);
          subject = parsed.subject || 'Partnership Opportunity with Automata Labs';
          emailBody = parsed.body || content;
        } catch {
          subject = 'Partnership Opportunity with Automata Labs';
          emailBody = content;
        }
      } else {
        // AI API failed — use fallback
        subject = `Partnership Opportunity for ${leadCompany || leadName}`;
        emailBody = generateFallbackEmail(leadName, leadCompany, websiteFlaws);
      }
    } else {
      // No OpenAI key — use intelligent fallback template
      subject = `Partnership Opportunity for ${leadCompany || leadName}`;
      emailBody = generateFallbackEmail(leadName, leadCompany, websiteFlaws);
    }

    // Save the drafted message to database
    const message = await prisma.outreachMessage.create({
      data: {
        leadId: leadId || 'manual',
        channel: 'email',
        subject,
        body: emailBody,
        status: 'draft',
        aiGenerated: !!openaiKey
      }
    });

    return NextResponse.json({
      id: message.id,
      subject,
      body: emailBody,
      aiGenerated: !!openaiKey,
      message: openaiKey ? 'AI-generated draft ready!' : 'Template draft ready (add OpenAI key in Settings for AI drafting)'
    });

  } catch (error) {
    console.error('Draft error:', error);
    return NextResponse.json({ error: 'Failed to generate draft' }, { status: 500 });
  }
}

function generateFallbackEmail(name: string, company: string | null, flaws: string | null): string {
  let email = `Hi ${name},\n\n`;
  email += `I hope this message finds you well. I'm reaching out from Automata Labs — we specialize in building enterprise-grade AI automation systems that help businesses scale their operations.\n\n`;
  
  if (flaws) {
    email += `While reviewing ${company ? company + "'s" : "your"} online presence, we noticed a few areas where we could help:\n\n${flaws}\n\n`;
    email += `Our team has helped companies like yours resolve these exact issues, resulting in measurable improvements in performance and conversions.\n\n`;
  } else {
    email += `We've been helping businesses like ${company || 'yours'} automate their workflows, build intelligent chatbots, and deploy AI agents that handle thousands of customer interactions per month.\n\n`;
  }
  
  email += `Would you be open to a 15-minute call this week to explore how we can help?\n\n`;
  email += `Best regards,\nAutomata Labs Team\nautomatalabs.io`;
  
  return email;
}
