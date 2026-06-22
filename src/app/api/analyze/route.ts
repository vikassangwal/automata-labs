import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { url } = body;

    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    // Ensure valid URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Fetch the target website's HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AutomataLabs-SEO-Analyzer/1.0',
      },
      // Short timeout so we don't hang
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Could not reach ${url} (Status: ${response.status})` }, { status: 400 });
    }

    const html = await response.text();
    
    // Parse HTML with Cheerio
    const $ = cheerio.load(html);

    // 1. SEO & Metadata Checks
    const title = $('title').text() || null;
    const metaDescription = $('meta[name="description"]').attr('content') || null;
    const viewport = $('meta[name="viewport"]').attr('content') || null;
    
    // 2. Structural Checks
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    
    // 3. Accessibility Checks
    const images = $('img');
    let imagesWithoutAlt = 0;
    images.each((_, img) => {
      if (!$(img).attr('alt')) imagesWithoutAlt++;
    });

    // 4. Performance Indicators (Basic)
    const scriptsCount = $('script').length;
    const isHeavyScripts = scriptsCount > 15;

    // Build the Flaws Report (Kamiyan)
    const flaws: string[] = [];
    if (!title) flaws.push('Missing Title Tag (Critical for SEO).');
    if (!metaDescription) flaws.push('Missing Meta Description (Hurts click-through rates).');
    if (!viewport) flaws.push('Missing Mobile Viewport Meta Tag (Not mobile-responsive).');
    if (h1Count === 0) flaws.push('Missing H1 Header (Poor content structure).');
    if (h1Count > 1) flaws.push('Multiple H1 Headers found (Confuses search engines).');
    if (imagesWithoutAlt > 0) flaws.push(`${imagesWithoutAlt} images missing 'alt' attributes (Accessibility issue).`);
    if (isHeavyScripts) flaws.push(`Too many scripts (${scriptsCount}) may cause slow page load times.`);

    const score = 100 - (flaws.length * 12); // Simple scoring logic

    const reportData = {
      url,
      score: score < 0 ? 0 : score,
      metrics: {
        title,
        hasDescription: !!metaDescription,
        h1Count,
        totalImages: images.length,
        imagesWithoutAlt
      },
      flaws,
      summary: flaws.length === 0 
        ? 'Excellent! The website seems technically sound based on our basic scan.' 
        : `Found ${flaws.length} critical issues that are hurting SEO and user experience.`
    };

    // Save report to database
    const analysis = await prisma.websiteAnalysis.create({
      data: {
        url,
        score: reportData.score,
        report: JSON.stringify(reportData)
      }
    });

    return NextResponse.json({ id: analysis.id, ...reportData });

  } catch (error: any) {
    console.error('Analyzer error:', error);
    return NextResponse.json({ error: 'Failed to analyze website. It might be blocking scraping.' }, { status: 500 });
  }
}
