import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';  
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from "./routers/auth.js";
import "./index.js";
import cookieParser from "cookie-parser";
export function setupServer() {
  const app = express();

  // Enable CORS
  app.use(cors());

  // Logger middleware
  app.use(pino());

  // JSON body parsing
  app.use(express.json());
app.use(cookieParser()); // cookie kullanabilmek için
  app.use("/auth", authRouter);
  // Routes
  app.use('/contacts', contactsRouter);

  // Mevcut olmayan rotalar için 404
  app.use(notFoundHandler);
  
 // Hata yakalama middleware'i
  app.use(errorHandler);

  // Örnek rota
  app.get('/', (req, res) => {
    res.send({ message: 'Server is running!' });
  });
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
  return app;
}
