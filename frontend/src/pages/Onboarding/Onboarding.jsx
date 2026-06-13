// src/pages/Onboarding/Onboarding.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Onboarding.scss';
import api from '../../api'; // <-- API import kar liya

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // API call ke time button disable karne ke liye
  const [user, setUser] = useState(null); // User ID store karne ke liye
  
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    height: '',
    goal: 'loss', 
    workoutTime: 15,
    alarmTime: '06:00' // Default subah 6 baje ka time
  });

  // Page load hote hi LocalStorage se user nikal lo taaki uska ID mil jaye
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('trackfit_user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateBMI = () => {
    const h = formData.height / 100;
    const bmi = (formData.weight / (h * h)).toFixed(1);
    return bmi;
  };

  // NAYA BACKEND API CALL YAHAN HAI
  const generateWeeklyRoutine = async () => {
    if (!user) return alert("User session lost. Please login again.");
    
    setIsLoading(true);
    try {
      // Backend ko data bheja (api interceptor apne aap token laga dega)
      const response = await api.post('/auth/onboarding', {
        userId: user._id,
        name: formData.name,
        weight: formData.weight,
        height: formData.height,
        goal: formData.goal,
        workoutTime: formData.workoutTime,
        alarmTime: formData.alarmTime
      });

      if (response.data.success) {
        // Backend se updated user data (jisme isOnboarded: true hai) wapas aaya, usko save kar liya
        localStorage.setItem('trackfit_user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Onboarding Error:", error);
      alert(error.response?.data?.message || "Failed to save profile. Server Error!");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="onboarding-container">
      <motion.div 
        key={step}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="form-card"
      >
        <div className="progress-indicator">Step {step} of 4</div>
        
        {step === 1 && (
          <div className="step-content">
            <h2>Let's build your profile.</h2>
            <input 
              type="text" name="name" placeholder="What do we call you?" 
              value={formData.name} onChange={handleChange} 
            />
            <button className="next-btn" onClick={() => setStep(2)}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Your Body Metrics</h2>
            <div className="input-group">
              <input 
                type="number" name="weight" placeholder="Weight (kg)" 
                value={formData.weight} onChange={handleChange} 
              />
              <input 
                type="number" name="height" placeholder="Height (cm)" 
                value={formData.height} onChange={handleChange} 
              />
            </div>
            <div className="goal-selector">
              <button 
                className={formData.goal === 'loss' ? 'active' : ''} 
                onClick={() => setFormData({...formData, goal: 'loss'})}
              >Weight Loss</button>
              <button 
                className={formData.goal === 'gain' ? 'active' : ''} 
                onClick={() => setFormData({...formData, goal: 'gain'})}
              >Weight Gain</button>
            </div>
            <div className="btn-group">
              <button className="back-btn" onClick={() => setStep(1)}>Back</button>
              <button className="next-btn" onClick={() => setStep(3)}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Commit your time.</h2>
            <p>How many minutes can you dedicate daily?</p>
            <div className="time-slider-container">
              <h2>{formData.workoutTime} mins</h2>
              <input 
                type="range" name="workoutTime" min="10" max="120" step="5"
                value={formData.workoutTime} onChange={handleChange} 
              />
            </div>
            <div className="btn-group">
              <button className="back-btn" onClick={() => setStep(2)}>Back</button>
              <button className="next-btn" onClick={() => setStep(4)}>Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <h2>Set the Alarm.</h2>
            <p>We will wake you up every day at this exact time. No excuses.</p>
            <div className="alarm-input-container">
              <input 
                type="time" 
                name="alarmTime" 
                value={formData.alarmTime} 
                onChange={handleChange} 
                className="alarm-time-picker"
              />
            </div>
            <div className="btn-group">
              <button className="back-btn" onClick={() => setStep(3)}>Back</button>
              {/* Button me bas isLoading logic lagaya hai taaki double click na ho */}
              <button className="next-btn generate-btn" onClick={generateWeeklyRoutine} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Lock & Generate'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Onboarding;