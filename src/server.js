// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

export function setupServer() {
  const app = express();

  // JSON body parsing
  app.use(express.json());

  // Enable CORS
  app.use(cors());

  // Logger middleware
  app.use(pino());

  // Örnek rota
  app.get('/', (req, res) => {
    res.send({ message: 'Server is running!' });
  });

  // Mevcut olmayan rotalar için 404
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
}
