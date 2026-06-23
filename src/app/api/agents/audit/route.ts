import { NextResponse } from 'next/server';
import { generateWithAI } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Please provide a valid URL starting with http or https' }, { status: 400 });
    }

    // Attempt to fetch the website content
    let rawHtml = '';
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AutomataBot/1.0)',
          'Accept': 'text/html'
        },
        signal: AbortSignal.timeout(8000) // 8 second timeout
      });
      rawHtml = await response.text();
    } catch (e: any) {
      return NextResponse.json({ error: `Failed to access website: ${e.message}. The site might block bots or is unreachable.` }, { status: 400 });
    }

    // Clean HTML to save AI tokens (remove scripts, styles, and extract text)
    const noScripts = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    const noStyles = noScripts.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    const cleanText = noStyles.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 5000); // Send max 5000 chars

    const prompt = `You are a strict but helpful Expert Website Auditor working for an agency. I am giving you the raw text extracted from a prospective client's website URL: ${url}. 
Your job is to find faults, bugs, missing SEO tags, and UI/UX issues, AND provide actionable suggestions on how our agency can fix them.

Website Text Content:
${cleanText}

Provide a highly professional, client-friendly audit report. Use clear markdown headings and bullet points. Focus on:
1. SEO & Meta data issues (with suggestions to fix).
2. Content & Copywriting flaws (with suggestions to improve conversion).
3. UI/UX & Technical observations.
4. "How We Can Help" - A small concluding section explaining how our agency can solve these problems quickly.

Make it sound like a premium consulting report.`;

    const aiReport = await generateWithAI(prompt);

    return NextResponse.json({ report: aiReport });

  } catch (error: any) {
    console.error('Audit Agent Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong while auditing' }, { status: 500 });
  }
}
