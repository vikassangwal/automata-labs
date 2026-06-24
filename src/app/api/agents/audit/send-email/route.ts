import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { marked } from 'marked';

export async function POST(request: Request) {
  try {
    const { targetEmail, websiteUrl, emailDraft } = await request.json();

    if (!targetEmail || !emailDraft) {
      return NextResponse.json({ error: 'Missing target email or email draft' }, { status: 400 });
    }

    // Get site name and email credentials
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    const emailSettings = await prisma.emailSettings.findUnique({ where: { id: 'default' } });
    
    if (!emailSettings || !emailSettings.emailUser || !emailSettings.appPassword) {
      return NextResponse.json({ error: 'Admin email settings not configured. Please go to Settings and add your Gmail and App Password.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailSettings.emailUser,
        pass: emailSettings.appPassword,
      },
    });

    // Convert any markdown in the draft to HTML
    const emailHtml = await marked.parse(emailDraft);

    const mailOptions = {
      from: `"${settings?.siteName || 'Automata Labs'}" <${emailSettings.emailUser}>`,
      to: targetEmail,
      subject: websiteUrl ? `Quick thoughts on ${websiteUrl}` : `Quick question regarding your website`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 15px; max-width: 600px; margin: 0 auto; color: #222;">
          ${emailHtml}
          <br/>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="color: #666; font-size: 13px;">
            Best regards,<br/>
            <strong>The ${settings?.siteName || 'Automata Labs'} Team</strong><br/>
            <a href="https://automata-labs.vercel.app" style="color: #8b5cf6;">automata-labs.vercel.app</a>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error: any) {
    console.error('Failed to send audit email:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
