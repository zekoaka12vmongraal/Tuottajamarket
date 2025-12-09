import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { supabase } from './services/supabase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- FALLBACK PRODUCTS ----------
const productsPath = path.join(__dirname, 'backend', 'data', 'products.json');
let fallbackProducts = [];

try {
  if (fs.existsSync(productsPath)) {
    fallbackProducts = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  } else {
    console.warn("products.json missing, fallback empty list");
  }
} catch (e) {
  console.error("Could not read products.json:", e);
  fallbackProducts = [];
}

const upload = multer();
const app = express();

app.use(cors());
app.use(express.json());

// ---------- STATIC FILES ----------
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

// Serve frontend build
app.use(express.static(path.join(__dirname, 'dist')));

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ---------- GET ALL PRODUCTS ----------
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return res.json(fallbackProducts);
    }

    res.json(data);
  } catch (e) {
    console.error("Virhe tuotteiden haussa:", e);
    res.json(fallbackProducts);
  }
});

// ---------- GET SINGLE PRODUCT ----------
app.get('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Not found' });

    res.json(data);
  } catch (e) {
    res.status(404).json({ error: 'Not found' });
  }
});

// ---------- CHECKOUT ----------
app.post('/api/checkout', (req, res) => {
  const { items } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'No items' });
  }

  const total = items.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);

  res.json({
    ok: true,
    orderId: 'ORDER-' + Date.now(),
    total
  });
});

// ---------- IMAGE UPLOAD ----------
app.post('/api/admin/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const name = Date.now() + "_" + req.file.originalname.replace(/\s+/g, "_");

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(name, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(name);

    res.json({ url: data.publicUrl });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- SPA FALLBACK ----------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend listening on port", PORT));
