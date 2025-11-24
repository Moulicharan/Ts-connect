// server/models/MessageRequest.js
const mongoose = require('mongoose');

const MessageRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  text: { type: String, default: '' }
});

// index to help queries (not unique because we allow history)
MessageRequestSchema.index({ from: 1, to: 1, status: 1 });

module.exports = mongoose.model('MessageRequest', MessageRequestSchema);
