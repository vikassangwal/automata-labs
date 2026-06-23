import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { generateWithAI } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { name, leadIds } = await req.json();

    if (!name || !leadIds || !Array.isArray(leadIds)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const settings = await prisma.emailSettings.findUnique({ where: { id: 'default' } });
    if (!settings || !settings.emailUser || !settings.appPassword) {
      return NextResponse.json({ error: 'SMTP credentials not configured in Email Hub' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpPort === 465,
      auth: {
        user: settings.emailUser,
        pass: settings.appPassword,
      },
    });

    const campaign = await prisma.campaign.create({
      data: {
        name,
        target: 'no_website',
        totalCount: leadIds.length,
        status: 'sending'
      }
    });

    const leads = await prisma.lead.findMany({
      where: { id: { in: leadIds } }
    });

    const siteSettings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    const aiContext = siteSettings?.aiContext ? `\nMy Biodata / Company Context:\n${siteSettings.aiContext}\n` : '';

    let sent = 0;
    let failed = 0;

    // Send emails sequentially to avoid rate limits
    for (const lead of leads) {
      if (!lead.email || lead.email.trim() === '') {
        failed++;
        continue;
      }
      try {
        const leadName = lead.name && lead.name.trim() !== '' ? lead.name : 'Business Owner';
        const leadCompany = lead.company && lead.company.trim() !== '' ? ` at ${lead.company}` : '';
        
        const prompt = `Write a short, professional, and highly persuasive email to ${leadName}${leadCompany}. 
They currently do NOT have a website. Explain the value of having a professional website (credibility, 24/7 lead generation, automation). Offer to build them a custom website. 
Keep it under 150 words. Do not use placeholders.${aiContext}`;

        const systemPrompt = `You are an expert sales copywriter. Use the provided company context to personalize the sender's details and pitch. DO NOT output any subject line. DO NOT use placeholders like [Name] or [Link]. If any data is missing, adapt the sentence to read naturally without placeholders. Return ONLY the email body ready to send.`;
        
        const aiResponse = await generateWithAI(prompt, systemPrompt);
        // Assuming aiResponse returns an object or string. We just use the string.
        const body = typeof aiResponse === 'string' ? aiResponse : (aiResponse as any).content || aiResponse;

        await transporter.sendMail({
          from: settings.emailUser,
          to: lead.email,
          subject: 'Is your business missing out on online growth?',
          text: body,
        });

        sent++;
        
        // Log outreach message
        await prisma.outreachMessage.create({
          data: {
            leadId: lead.id,
            channel: 'email',
            subject: 'Website Pitch Campaign',
            body: body,
            status: 'sent',
            aiGenerated: true
          }
        });

      } catch (err) {
        failed++;
        console.error(`Failed to send to ${lead.email}`, err);
      }
    }

    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: 'completed', sentCount: sent }
    });

    return NextResponse.json({ success: true, sent, failed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
