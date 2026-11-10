import { WebSocketServer } from 'ws';
import { User } from './User';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {
  const user = new User(ws);
  ws.on('error', (error) => {
    console.error("WebSocket connection error:", error);
  });

  ws.on('close', () => {
    user.destroy();
  });
});

wss.on('error', (error) => {
  console.error("WebSocket server error:", error);
});