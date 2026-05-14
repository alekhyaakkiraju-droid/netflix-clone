import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import logger from './lib/logger';

const app = express();

// ── Security headers (Helmet sets X-Frame-Options, CSP, HSTS, etc.) ──────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

// ── CORS — allow only configured origin ───────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, health checks)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  }),
);

// ── Request logging ───────────────────────────────────────────────────────────
app.use(pinoHttp({ logger }));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Module routers (stubs — filled in by subsequent WOs) ─────────────────────
// Each module exposes a router at src/modules/<name>/router.ts
import authRouter from './modules/auth/router';
import profilesRouter from './modules/profiles/router';
import subscriptionsRouter from './modules/subscriptions/router';
import paymentsRouter from './modules/payments/router';
import preferencesRouter from './modules/preferences/router';
import videosRouter from './modules/videos/router';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profiles', profilesRouter);
app.use('/api/v1/subscriptions', subscriptionsRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/preferences', preferencesRouter);
app.use('/api/v1/videos', videosRouter);

// ── 404 + global error handler (must come last) ───────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
