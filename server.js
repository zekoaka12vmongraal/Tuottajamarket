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
const productsPath = path.join(__dirname, 'data', 'products.json');

// Fallback products from JSON (jos Supabase ei toimi)
let fallbackProducts = [];
try { 
  fallbackProducts = JSON.parse(fs.readFileSync(productsPath, 'utf-8')); 
} catch(e) { 
  console.error('Could not read products.json', e); 
  fallbackProducts = []; 
}

const upload = multer();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

app.use(express.static('dist'));
app.get('/api/health', (req, res) => res.json({ok: true}));

// ⬇️ KORJATTU: Hae tuotteet Supabasesta
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.json(fallbackProducts);
    }
    
    console.log(`Haettiin ${data.length} tuotetta Supabasesta`);
    res.json(data);
    
  } catch (e) {
    console.error('Virhe tuotteiden haussa:', e);
    res.json(fallbackProducts);
  }
});

// ⬇️ Hae yksittäinen tuote
app.get('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    res.json(data);
    
  } catch (e) {
    console.error('Virhe tuotteen haussa:', e);
    res.status(404).json({ error: 'Not found' });
  }
});

app.post('/api/checkout', (req, res) => { 
  const { items, customer } = req.body; 
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items' });
  }
  const total = items.reduce((s, i) => s + (i.price * (i.qty || 1)), 0); 
  return res.json({ 
    ok: true, 
    orderId: 'ORDER-' + Date.now(), 
    total 
  }); 
});

app.post('/api/admin/upload', upload.single('file'), async (req, res) => { 
  try { 
    if (!req.file) {
      return res.status(400).json({ error: 'No file' });
    }
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }
    
    const name = Date.now() + '_' + req.file.originalname.replace(/\s+/g, '_'); 
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
    
  } catch(e) { 
    console.error(e); 
    res.status(500).json({ error: e.message }); 
  } 
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Backend listening on', PORT));
