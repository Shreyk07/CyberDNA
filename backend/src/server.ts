import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Restrained, secure CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'CyberDNA Behavioral Fingerprinting & Digital Forensics Platform',
    timestamp: new Date().toISOString()
  });
});

// Mount modular API
app.use('/api', apiRouter);

const server = app.listen(PORT, () => {
  console.log(`[CyberDNA API] Server listening on http://localhost:${PORT}`);
  console.log(`[CyberDNA API] Endpoints available at http://localhost:${PORT}/api/stats/overview`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[CyberDNA API] Port ${PORT} is already in use. Reusing active instance.`);
  } else {
    console.error('[CyberDNA API] Server error:', err);
  }
});
