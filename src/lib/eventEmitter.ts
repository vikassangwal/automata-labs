import { EventEmitter } from 'events';

// Create a global EventEmitter instance so it persists across hot-reloads in development
const globalForEvents = globalThis as unknown as {
  emitter: EventEmitter | undefined;
};

export const eventEmitter = globalForEvents.emitter ?? new EventEmitter();

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.emitter = eventEmitter;
}

// Increase max listeners if needed
eventEmitter.setMaxListeners(50);
