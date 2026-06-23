import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { marked } from 'marked';

export async function POST(request: Request) {
  try {
    const { targetEmail, websiteUrl, report } = await request.json();

    if (!targetEmail || !websiteUrl || !report) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get SMTP credentials from Site Settings
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    if (!settings || !settings.emailUser || !settings.emailPassword) {
      return NextResponse.json({ error: 'Admin email settings not configured. Please go to Settings and add your Gmail and App Password.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: settings.emailUser,
        pass: settings.emailPassword,
      },
    });

    // Convert markdown report to HTML
    const reportHtml = await marked.parse(report);

    const mailOptions = {
      from: `"${settings.siteName}" <${settings.emailUser}>`,
      to: targetEmail,
      subject: `Free Website Audit Report: ${websiteUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333;">
          <h2 style="color: #0066cc;">Website Audit Report for ${websiteUrl}</h2>
          <p>Hi there,</p>
          <p>Our AI Agent recently analyzed your website, and we found several critical areas that could be improved to increase your traffic and conversions. Here is the detailed report:</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; font-size: 14px; line-height: 1.6;">
            ${reportHtml}
          </div>

          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p>If you'd like our help fixing these issues and upgrading your online presence, just reply to this email!</p>
          <p>Best regards,<br/><strong>The ${settings.siteName} Team</strong></p>
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
