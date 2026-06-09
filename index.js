import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db/supabase.js';
import sessionRoutes from './routes/session.js';
import topicsRoutes from './routes/topics.js';
import historyRoutes from './routes/history.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://inter-view-bot-f.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/session', sessionRoutes);
app.use('/topics', topicsRoutes);
app.use('/history', historyRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀 talk_to_me API running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
