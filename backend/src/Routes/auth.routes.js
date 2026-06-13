// backend/src/Routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, saveOnboarding, updatePhone } = require('../controllers/auth.controller');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.put('/update-phone', updatePhone);
router.post('/onboarding', saveOnboarding);

module.exports = router;