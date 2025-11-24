// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;
const ALLOWED_DOMAIN = 'student.nitw.ac.in'; // only allow signups from this domain

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

// Static: check if email is allowed (college domain)
UserSchema.statics.isCollegeEmail = function(email) {
  if (!email || typeof email !== 'string') return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  return parts[1].toLowerCase() === ALLOWED_DOMAIN;
};

// Instance: compare password
UserSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Static helper: hash password
UserSchema.statics.hashPassword = async function(plain) {
  return await bcrypt.hash(plain, SALT_ROUNDS);
};

module.exports = mongoose.model('User', UserSchema);
