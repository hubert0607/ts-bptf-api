import ReconnectingWebSocket from 'reconnecting-websocket';
import WebSocket from 'ws';
import { EventMessage } from './interfaces/websocket';


const WS_URL = 'wss://ws.backpack.tf/events';

export async function initializeWebsocket(processEvents: (events: EventMessage[]) => void) {


  const ws = new (ReconnectingWebSocket as any)(WS_URL, [], {
    WebSocket, 
    connectionTimeout: 5000,
    maxRetries: Infinity,
    maxReconnectionDelay: 30000,
    minReconnectionDelay: 1000,
  });

  ws.addEventListener('open', () => console.log('🔌 Connected to WebSocket server'));
  ws.addEventListener('close', (e: CloseEvent) => console.log(`🔌 WebSocket closed: ${e.code} ${e.reason}`));
  ws.addEventListener('error', (err: Event) => console.error('❌ WebSocket error:', err));


  ws.addEventListener('message', (event: MessageEvent) => {
  try {
    let events: EventMessage[] = JSON.parse(event.data.toString());
    events = events.filter(e => e.payload.appid === 440)
    if (events.length === 0) {
      return;
    }

    processEvents(events);

  } catch (err) {
    console.error('❌ Failed to parse or save event:', err);
  }
});
}