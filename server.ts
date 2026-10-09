import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS, REVIEWS } from './src/data/products.ts';
import { Order, Review } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory persistent stores for active dev session
let serverReviews: Review[] = [...REVIEWS];
let serverOrders: Order[] = [];

// API Endpoints
app.get('/api/products', (req, res) => {
  const { category, q } = req.query;
  let filtered = [...PRODUCTS];

  if (category && category !== 'ALL') {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (typeof q === 'string' && q.trim()) {
    const search = q.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
    );
  }

  res.json({ products: filtered });
});

app.get('/api/reviews', (_req, res) => {
  res.json({ reviews: serverReviews });
});

app.post('/api/reviews', (req, res) => {
  const newReview: Review = {
    ...req.body,
    id: `rev-${Date.now()}`,
    date: new Date().toLocaleDateString('pt-BR'),
  };
  serverReviews.unshift(newReview);
  res.status(201).json({ review: newReview });
});

app.get('/api/orders', (req, res) => {
  const { email } = req.query;
  if (typeof email === 'string' && email.trim()) {
    const userOrders = serverOrders.filter(
      (o) => o.customerEmail.toLowerCase() === email.toLowerCase().trim()
    );
    return res.json({ orders: userOrders });
  }
  res.json({ orders: serverOrders });
});

app.post('/api/orders', (req, res) => {
  const newOrder: Order = {
    ...req.body,
    id: req.body.id || `ABRAV-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toLocaleDateString('pt-BR'),
  };
  serverOrders.unshift(newOrder);
  res.status(201).json({ order: newOrder });
});

// Server-side Vite or Production Static Middleware
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production' && !process.argv.includes('--production');

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Abravanel Shop Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
