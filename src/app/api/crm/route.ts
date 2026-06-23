import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eventEmitter } from '@/lib/eventEmitter';
import { getAIConfig, generateAIContent } from '@/lib/ai';

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newLead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        company: body.company || null,
        website: body.website || null,
        message: body.message || null,
        status: 'New',
        source: body.source || 'contact_form'
      }
    });

    // Auto-generate a draft message using AI if website or message is provided
    try {
      const aiConfig = await getAIConfig();
      if (aiConfig) {
        const prompt = `You are a professional sales agent. A new lead named ${body.name} has contacted us.
Email: ${body.email}
${body.company ? `Company: ${body.company}` : ''}
${body.website ? `Website: ${body.website}` : ''}
${body.message ? `Requirements: ${body.message}` : ''}

Draft a personalized, short, and engaging outreach email (subject and body) to follow up with them. Focus on how we can help them with their specific requirements or website. Format exactly as:
Subject: [Your Subject]
Body: [Your Body]`;

        const aiResponse = await generateAIContent(aiConfig, prompt, '', 500);
        
        let subject = `Following up with ${body.name}`;
        let bodyText = aiResponse;
        
        const subjMatch = aiResponse.match(/Subject:\s*(.*)/i);
        const bodyMatch = aiResponse.match(/Body:\s*([\s\S]*)/i);
        
        if (subjMatch && subjMatch[1]) subject = subjMatch[1].trim();
        if (bodyMatch && bodyMatch[1]) bodyText = bodyMatch[1].trim();

        const messageDraft = await prisma.outreachMessage.create({
          data: {
            leadId: newLead.id,
            channel: 'email',
            subject,
            body: bodyText,
            status: 'draft',
            aiGenerated: true
          }
        });

        // Try to auto-send the email if SMTP is configured
        try {
          const settings = await prisma.emailSettings.findUnique({ where: { id: 'default' } });
          if (settings && settings.emailUser && settings.appPassword) {
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
              host: settings.smtpHost,
              port: settings.smtpPort,
              secure: settings.smtpPort === 465,
              auth: {
                user: settings.emailUser,
                pass: settings.appPassword,
              },
            });

            await transporter.sendMail({
              from: settings.emailUser,
              to: body.email,
              subject: subject,
              text: bodyText,
            });

            await prisma.outreachMessage.update({
              where: { id: messageDraft.id },
              data: { status: 'sent' }
            });
            
            await prisma.lead.update({
              where: { id: newLead.id },
              data: { status: 'Contacted' }
            });
          }
        } catch (mailErr) {
          console.error('Failed to auto-send email:', mailErr);
        }
      }
    } catch (e) {
      console.error('Failed to auto-generate message:', e);
    }

    // Emitting real-time alert to admin dashboard
    eventEmitter.emit('new-lead', newLead);

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
