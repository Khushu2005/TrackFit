// backend/src/utils/emailTemplate.js
exports.welcomeTemplate = (name) => `
  <div style="font-family: Arial, sans-serif; background-color: #20201F; color: #F8F8F8; padding: 20px;">
    <h1 style="color: #EE6E4D;">Welcome to TrackFit, ${name}!</h1>
    <p>Your ultimate fitness journey begins now. Let's crush those goals!</p>
  </div>
`;

exports.otpTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Your TrackFit Verification Code</h2>
    <h1 style="color: #EE6E4D; letter-spacing: 4px;">${otp}</h1>
    <p>This code is valid for 10 minutes. Do not share it with anyone.</p>
  </div>
`;