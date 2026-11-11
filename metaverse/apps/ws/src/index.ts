import { WebSocketServer } from 'ws';
import { User } from './User';

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
const wss = new WebSocketServer({ port });

console.log(`WebSocket server running on port ${port}`);

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