import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode');

  try {
    if (mode === 'settings') {
      let settings = await prisma.emailSettings.findUnique({ where: { id: 'default' } });
      if (!settings) {
        settings = await prisma.emailSettings.create({
          data: { id: 'default' }
        });
      }
      return NextResponse.json({ settings });
    }

    if (mode === 'fetch') {
      const messages = await prisma.inboxMessage.findMany({
        orderBy: { date: 'desc' },
        take: 50
      });
      return NextResponse.json({ messages });
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode');

  try {
    if (mode === 'settings') {
      const data = await req.json();
      const settings = await prisma.emailSettings.upsert({
        where: { id: 'default' },
        update: {
          emailUser: data.emailUser,
          appPassword: data.appPassword,
          imapHost: data.imapHost,
          smtpHost: data.smtpHost,
          imapPort: parseInt(data.imapPort || '993'),
          smtpPort: parseInt(data.smtpPort || '465')
        },
        create: {
          id: 'default',
          emailUser: data.emailUser,
          appPassword: data.appPassword,
          imapHost: data.imapHost,
          smtpHost: data.smtpHost,
          imapPort: parseInt(data.imapPort || '993'),
          smtpPort: parseInt(data.smtpPort || '465')
        }
      });
      return NextResponse.json({ success: true, settings });
    }

    // Default mode: Sync IMAP
    const settings = await prisma.emailSettings.findUnique({ where: { id: 'default' } });
    if (!settings || !settings.emailUser || !settings.appPassword) {
      return NextResponse.json({ error: 'IMAP credentials not configured' }, { status: 400 });
    }

    const config = {
      imap: {
        user: settings.emailUser,
        password: settings.appPassword,
        host: settings.imapHost,
        port: settings.imapPort,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 30000
      }
    };

    let connection: any;
    try {
      connection = await imaps.connect(config);
    } catch (e: any) {
      return NextResponse.json({ error: 'IMAP connection failed: ' + e.message }, { status: 401 });
    }

    await connection.openBox('INBOX');
    
    // Fetch last 24 hours of emails
    const delay = 24 * 3600 * 1000;
    const yesterday = new Date();
    yesterday.setTime(Date.now() - delay);
    const searchCriteria = ['UNSEEN', ['SINCE', yesterday]];
    
    const fetchOptions = { bodies: ['HEADER', 'TEXT'], struct: true, markSeen: true };
    const messages = await connection.search(searchCriteria, fetchOptions);

    let synced = 0;

    for (const item of messages) {
      const all = item.parts.find((part: any) => part.which === 'TEXT' || part.which === '');
      const id = item.attributes.uid;
      const idHeader = 'Imap-Uid: ' + id + '\r\n';
      
      const mail = await simpleParser(idHeader + all?.body);
      
      const messageId = mail.messageId || `uid-${id}`;
      const existing = await prisma.inboxMessage.findUnique({ where: { messageId } });
      
      if (!existing) {
        await prisma.inboxMessage.create({
          data: {
            messageId,
            subject: mail.subject,
            from: mail.from?.text || 'Unknown',
            to: mail.to?.text || settings.emailUser,
            date: mail.date || new Date(),
            text: mail.text,
            html: mail.html,
          }
        });
        synced++;

        // Add lead to CRM if we don't have it
        const fromEmail = mail.from?.value?.[0]?.address;
        const fromName = mail.from?.value?.[0]?.name;
        if (fromEmail && fromEmail !== settings.emailUser) {
           const leadExists = await prisma.lead.findFirst({ where: { email: fromEmail } });
           if (!leadExists) {
             await prisma.lead.create({
               data: {
                 name: fromName || fromEmail.split('@')[0],
                 email: fromEmail,
                 source: 'inbox_ai',
                 message: mail.text?.substring(0, 500)
               }
             });
           }
        }
      }
    }

    connection.end();

    return NextResponse.json({ success: true, synced });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
