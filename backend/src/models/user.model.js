// backend/src/models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  
  // Onboarding Details
  name: { type: String, default: '' },
  weight: { type: Number, default: null },
  height: { type: Number, default: null },
  goal: { type: String, enum: ['loss', 'gain', ''], default: '' },
  workoutTime: { type: Number, default: 60 }, // in minutes
  alarmTime: { type: String, default: '' },
  
  isOnboarded: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);