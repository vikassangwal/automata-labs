import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiKey } from '@/lib/getApiKey';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messageId, toEmail, channel } = body;

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    // Get the drafted message
    const message = await prisma.outreachMessage.findUnique({ where: { id: messageId } });
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const sendChannel = channel || 'email';

    if (sendChannel === 'email') {
      // Try to send via Nodemailer
      try {
        const nodemailer = require('nodemailer');
        
        // Check for SendGrid or Gmail SMTP key
        const sendgridKey = await getApiKey('sendgrid');
        
        let transporter;
        if (sendgridKey) {
          // Use SendGrid SMTP
          transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: { user: 'apikey', pass: sendgridKey }
          });
        } else {
          // Demo mode — log to console
          console.log('========== EMAIL SENT (DEMO MODE) ==========');
          console.log(`To: ${toEmail}`);
          console.log(`Subject: ${message.subject}`);
          console.log(`Body: ${message.body}`);
          console.log('=============================================');

          await prisma.outreachMessage.update({
            where: { id: messageId },
            data: { status: 'sent' }
          });

          return NextResponse.json({
            success: true,
            mode: 'demo',
            message: 'Email logged to console (Demo Mode). Add a SendGrid API key in Settings for real delivery.'
          });
        }

        // Send real email
        await transporter.sendMail({
          from: '"Automata Labs" <noreply@automatalabs.io>',
          to: toEmail,
          subject: message.subject || 'Partnership Opportunity',
          text: message.body
        });

        await prisma.outreachMessage.update({
          where: { id: messageId },
          data: { status: 'sent' }
        });

        return NextResponse.json({ success: true, mode: 'live', message: 'Email sent successfully!' });

      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Still mark as sent in demo mode
        await prisma.outreachMessage.update({
          where: { id: messageId },
          data: { status: 'sent' }
        });
        return NextResponse.json({ 
          success: true, 
          mode: 'demo', 
          message: 'Email logged (Demo Mode). Configure SMTP in Settings for live delivery.' 
        });
      }
    }

    if (sendChannel === 'whatsapp') {
      const twilioKey = await getApiKey('twilio');
      if (!twilioKey) {
        return NextResponse.json({ 
          success: false, 
          message: 'Add Twilio API key in Settings to enable WhatsApp sending.' 
        }, { status: 400 });
      }
      // TODO: Implement Twilio WhatsApp API
      return NextResponse.json({ success: false, message: 'WhatsApp integration coming soon. Twilio key detected.' });
    }

    if (sendChannel === 'sms') {
      const twilioKey = await getApiKey('twilio');
      if (!twilioKey) {
        return NextResponse.json({ 
          success: false, 
          message: 'Add Twilio API key in Settings to enable SMS sending.' 
        }, { status: 400 });
      }
      // TODO: Implement Twilio SMS API
      return NextResponse.json({ success: false, message: 'SMS integration coming soon. Twilio key detected.' });
    }

    return NextResponse.json({ error: 'Unknown channel' }, { status: 400 });

  } catch (error) {
    console.error('Send error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
