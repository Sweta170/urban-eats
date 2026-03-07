const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinOrderRange', (orderId) => {
    socket.join(orderId);
    console.log(`User joined room: ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Attach io to app for use in controllers
app.set('socketio', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
