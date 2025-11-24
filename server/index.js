const express = require('express');
const cors = require('cors');
// near top of file, after requires
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fullstack_quick';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  });


const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from server', time: new Date().toISOString() });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

// simple in-memory messages store
const messages = [
  { id: 1, text: "Welcome!", time: new Date().toISOString() }
];

// GET all messages
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// POST a new message (expects { text: "..." } in JSON body)
app.post('/api/messages', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Text required' });
  const msg = { id: messages.length + 1, text: text.trim(), time: new Date().toISOString() };
  messages.push(msg);
  res.status(201).json(msg);
});

const requestRoutes = require('./routes/requests');
app.use('/api/requests', requestRoutes);

