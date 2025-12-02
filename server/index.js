// server/index.js (essential parts)
const express = require('express');
const cors = require('cors'); // optional but recommended for dev
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json()); // <--- REQUIRED for req.body

// optional: mount your other route files here (auth, users, etc.)
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

// === in-memory / DB-backed messages (your pasted snippet) ===
let MessageModel = null;
try {
  MessageModel = require('./models/Message');
} catch (err) {
  MessageModel = null;
}

if (!global.__DEV_MESSAGES) global.__DEV_MESSAGES = [];
const devMessages = global.__DEV_MESSAGES;

function normalizeMessage(doc) {
  if (!doc) return null;
  if (doc._id) {
    return {
      _id: doc._id,
      text: doc.text || '',
      time: doc.createdAt || doc.time || new Date().toISOString(),
      from: doc.from || doc.user || doc.author || null,
    };
  }
  return {
    id: doc.id || String(doc._id || ''),
    text: doc.text || '',
    time: doc.time || doc.createdAt || new Date().toISOString(),
    from: doc.from || null,
  };
}

app.get('/api/messages', async (req, res) => {
  try {
    if (MessageModel) {
      const docs = await MessageModel.find({}).sort({ createdAt: -1 }).limit(200);
      return res.json(docs.map(normalizeMessage));
    } else {
      return res.json(devMessages);
    }
  } catch (err) {
    console.error('GET /api/messages error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || !String(text).trim()) return res.status(400).json({ error: 'Text required' });

    if (MessageModel) {
      const doc = new MessageModel({
        text: String(text).trim(),
        ...(req.user ? { user: req.user.id, from: req.user.id } : {}),
      });
      await doc.save();
      return res.status(201).json(normalizeMessage(doc));
    } else {
      const id = (devMessages.length ? Number(devMessages[devMessages.length - 1].id || devMessages[devMessages.length - 1]._id || 0) + 1 : 1);
      const msg = { id: String(id), text: String(text).trim(), time: new Date().toISOString() };
      devMessages.push(msg);
      return res.status(201).json(msg);
    }
  } catch (err) {
    console.error('POST /api/messages error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (MessageModel) {
      const doc = await MessageModel.findById(id);
      if (!doc) return res.status(404).json({ error: 'Message not found' });

      if (doc.user && req.user && doc.user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await MessageModel.findByIdAndDelete(id);
      return res.json({ ok: true, id });
    } else {
      const idx = devMessages.findIndex(m => (m._id === id || m.id === id || String(m.id) === id));
      if (idx === -1) return res.status(404).json({ error: 'Message not found' });
      devMessages.splice(idx, 1);
      return res.json({ ok: true, id });
    }
  } catch (err) {
    console.error('DELETE /api/messages/:id error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// static/other routes and finally listen
// app.use(express.static(path.join(__dirname, '..', 'client', 'build'))); // if serving react build

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
