// backend/src/models/otp.model.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  // Bhaai ye 'expires' property automatically 10 min (600 seconds) baad document delete kar degi db se
  createdAt: { type: Date, default: Date.now, expires: 600 } 
});

module.exports = mongoose.model('OTP', otpSchema);