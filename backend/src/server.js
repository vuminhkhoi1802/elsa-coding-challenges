// src/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const setupSocketHandlers = require('./socketHandlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

