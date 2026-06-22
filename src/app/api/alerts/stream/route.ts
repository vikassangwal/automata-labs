export const dynamic = 'force-dynamic';

import { eventEmitter } from '@/lib/eventEmitter';

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', message: 'SSE Connected' })}\n\n`));

      // Listener for new leads
      const onNewLead = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'new-lead', data })}\n\n`));
      };

      eventEmitter.on('new-lead', onNewLead);

      // Handle disconnect
      request.signal.addEventListener('abort', () => {
        eventEmitter.off('new-lead', onNewLead);
        controller.close();
      });
    }
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
