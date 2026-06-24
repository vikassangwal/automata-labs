import { NextResponse } from 'next/server';
import { generateWithDynamicAI } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { websiteUrl, report, emailModel } = await request.json();

    if (!websiteUrl || !report) {
      return NextResponse.json({ error: 'Website URL and Audit Report are required' }, { status: 400 });
    }

    const systemPrompt = `You are an Expert B2B Copywriter and Sales Executive for 'Automata Labs', an elite AI Automation & Software Agency.
Your task is to draft a highly personalized, professional cold email to the owner of the website: ${websiteUrl}.`;

    const prompt = `Here is the SEO & Technical Audit Report we just generated for ${websiteUrl}:

${report}

Draft a cold outreach email pitching our agency's services. 
Rules:
1. Start with a friendly, professional greeting.
2. Mention 1 or 2 specific, critical flaws from the audit report to prove we actually reviewed their site (e.g., a specific missing SEO tag, slow load time, or UI bug).
3. Naturally transition into how Automata Labs can fix these issues and build them a faster, AI-powered system that drives more conversions.
4. Keep the tone helpful, not aggressive or overly salesy.
5. Provide a clear Call to Action (e.g., "Reply to this email if you'd like to discuss...").
6. Output ONLY the email body (do not include subject lines or placeholder brackets like [Your Name], assume the sender signature will be appended later).`;

    const emailDraft = await generateWithDynamicAI(emailModel, prompt, systemPrompt);

    return NextResponse.json({ draft: emailDraft });

  } catch (error: any) {
    console.error('Email Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong while drafting the email' }, { status: 500 });
  }
}
