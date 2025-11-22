import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import api from './routes/api';
import main from './routes/main';
import retro from './routes/retro';
import retroGames from './routes/retro-games';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// Serve static files (only for development)
try {
  app.use('/static/*', serveStatic({ root: './public' }));
} catch (e) {
  // Static files will be handled by Cloudflare Pages in production
}

// Mount routes
app.route('/api', api);
app.route('/', main);              // v3.0 as default (new design)
app.route('/retro', retro);        // v2.2 classic version
app.route('/retro/games', retroGames);

export default app;
