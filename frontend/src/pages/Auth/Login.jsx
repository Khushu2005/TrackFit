// src/pages/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png'; 
import './Login.scss';
import api from '../../api';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = async () => {
    if (phone.length < 10) return alert("Valid number daal");
    setIsLoading(true);
    try {
      const response = await api.post('/auth/send-otp', { phone });
      if (response.data.success) setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Server Error!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) return;
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp });
      if (response.data.success) {
        // 1. Token aur User ko save karna zaroori hai
        localStorage.setItem('trackfit_token', response.data.token);
        localStorage.setItem('trackfit_user', JSON.stringify(response.data.user));

        // 2. Decide karo kahan bhejna hai
        if (response.data.user.isOnboarded) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Server Error!");
    } finally {
      setIsLoading(false);
    }
  };

  // Ise bas ek hi baar define karna hai, aur isme koi functions nahi honge
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="login-container">
      <motion.div 
        className="auth-card"
        key={step}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {/* <div className="brand-header">
          <img src={logo} alt="TrackFit Logo" className="brand-logo" />
          <h2>TRACKFIT</h2>
        </div> */}

        {step === 1 && (
          <div className="auth-step">
            <h1>Welcome Back.</h1>
            <p>Enter your number to get started.</p>
            
            <div className="phone-input-wrapper">
              <span className="country-code">+91</span>
              <input 
                type="tel" 
                placeholder="99999 00000" 
                maxLength="10" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                autoFocus
              />
            </div>

            <button className="primary-auth-btn" onClick={handleSendOTP} disabled={isLoading || phone.length < 10}>
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="auth-step">
            <h1>Verify Code.</h1>
            <p>We sent a 4-digit code to +91 {phone}</p>
            
            <input 
              type="number" 
              className="otp-input no-spinners" 
              placeholder="• • • •" 
              maxLength="4" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)}
              autoFocus
            />

            <button className="primary-auth-btn" onClick={handleVerifyOTP} disabled={isLoading || otp.length !== 4}>
              {isLoading ? "Verifying..." : "Verify & Enter"}
            </button>
            <button className="text-btn" onClick={() => setStep(1)}>
              Change Number
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;