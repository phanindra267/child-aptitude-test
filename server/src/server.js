const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { connectMongoDB, connectPostgres } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const httpServer = createServer(app);

// Real-Time Communication via Socket.IO
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://aptitudepro.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Database connections
connectMongoDB();
const pgDb = connectPostgres();

// Attach dependencies to request
app.use((req, res, next) => {
  req.io = io;
  req.db = pgDb;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/children', require('./routes/child.routes'));
app.use('/api/questions', require('./routes/question.routes'));
app.use('/api/tests', require('./routes/test.routes'));
app.use('/api/results', require('./routes/result.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/cms', require('./routes/cms.routes'));
app.use('/api/sync', require('./routes/sync.routes'));
app.use('/api/gamification', require('./routes/gamification.routes'));
app.use('/api/reports', require('./routes/reports.routes'));

// Health check
app.get('/api/admin/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// Socket.IO namespaces
const notifications = io.of('/notifications');
const gamification = io.of('/gamification');
const proctoring = io.of('/proctoring');
const syncEvents = io.of('/sync_events');

notifications.on('connection', (socket) => {
  console.log('Client connected to notifications:', socket.id);
});
gamification.on('connection', (socket) => {
  console.log('Client connected to gamification:', socket.id);
});
proctoring.on('connection', (socket) => {
  console.log('Client connected to proctoring:', socket.id);
});
syncEvents.on('connection', (socket) => {
  console.log('Client connected to sync_events:', socket.id);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
