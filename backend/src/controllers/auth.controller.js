// backend/src/controllers/auth.controller.js
const OTP = require('../models/otp.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const whatsappClient = require('../utils/whatsapp');

// Generate JWT without Expiry (Tbtk chalega jab tk logout na ho)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey'); 
};

exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone number zaroori hai' });

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    await OTP.findOneAndDelete({ phone });
    await OTP.create({ phone, otp: generatedOtp });

    // WhatsApp format ke liye number ke aage country code aur '@c.us' lagana zaroori hai
    // Agar phone me pehle se +91 nahi hai toh jod do (Assuming Indian Numbers)
    const formattedPhone = phone.startsWith('91') ? `${phone}@c.us` : `91${phone}@c.us`;

    const messageText = `*TrackFit Verification Code*\n\nYour 4-digit login code is: *${generatedOtp}*.\nThis code is valid for 10 minutes. Do not share it with anyone.`;

    // WhatsApp par message bhej diya!
    try {
      await whatsappClient.sendMessage(formattedPhone, messageText);
      console.log(`[WhatsApp Sent] OTP ${generatedOtp} successfully sent to ${phone}`);
    } catch (wsError) {
      console.error("WhatsApp message send karne me error:", wsError);
      // Fallback: Agar WhatsApp fail ho toh terminal me log dikha do taaki testing na ruke
      console.log(`[FALLBACK DEV LOG] OTP for ${phone} is ${generatedOtp}`);
    }

    res.status(200).json({ success: true, message: 'OTP sent successfully via WhatsApp!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Check if OTP exists and matches
    const validOtp = await OTP.findOne({ phone, otp });
    if (!validOtp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // OTP Sahi hai, isko DB se hata do
    await OTP.findByIdAndDelete(validOtp._id);

    // Check if user exists, otherwise create
    let user = await User.findOne({ phone });
    let isNewUser = false;
    
    if (!user) {
      user = await User.create({ phone });
      isNewUser = true;
    }

    // Give Non-Expiring Token
    const token = generateToken(user._id);

    res.status(200).json({ 
      success: true, 
      message: 'Verified successfully', 
      token, 
      user, 
      isNewUser 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePhone = async (req, res) => {
  try {
    // Req.user aayega ek auth middleware se jo token verify karega (abhi basic rakh rahe hain)
    const { userId, newPhone } = req.body; 

    const phoneExists = await User.findOne({ phone: newPhone });
    if(phoneExists) return res.status(400).json({ success: false, message: 'Number already registered!' });

    const updatedUser = await User.findByIdAndUpdate(userId, { phone: newPhone }, { new: true });
    
    res.status(200).json({ success: true, message: 'Phone updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveOnboarding = async (req, res) => {
  try {
    const { userId, name, weight, height, goal, workoutTime, alarmTime } = req.body;

    const user = await User.findByIdAndUpdate(
      userId, 
      { name, weight, height, goal, workoutTime, alarmTime, isOnboarded: true }, 
      { new: true }
    );

    // Yahan Welcome Email bhej sakte ho:
    // await sendEmail({ email: user.email, subject: 'Welcome!', html: welcomeTemplate(user.name) });

    res.status(200).json({ success: true, message: 'Profile built successfully!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};