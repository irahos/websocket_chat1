const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

ws.on('connection', (socket) => {
  console.log('A new client connected');

  socket.on('message', (message) => {
  console.log(`Received message: ${message}`);

  ws.clients.forEach((client) => {
    if (client !== socket && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'message', content: message }));
    }
  });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})