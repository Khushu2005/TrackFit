// src/pages/Splash/Splash.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png'; // Naya bina bg wala logo import
import './Splash.scss';

const Splash = () => {
  const navigate = useNavigate();

  // 1. Logo pehle chhota hoga, fir smoothly scale hoke apne original size me aayega
  const logoVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    show: { 
      scale: 1, 
      opacity: 1, 
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const title = "TRACKFIT";

  // 2. Typing Container: Logo aane ke baad start hoga (delayChildren)
  const typingContainer = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.12, // Har letter ke beech ka typing delay
        delayChildren: 1.0     // Logo aane ke baad typing shuru
      }
    }
  };

  // 3. Single Letter: Ekdum keyboard typing jaisa pop hoga
  const letterVariants = {
    hidden: { opacity: 0, display: 'none' },
    show: { 
      opacity: 1, 
      display: 'inline-block',
      transition: { duration: 0.05 } 
    }
  };

  // 4. THE MAGIC: Ye function tab chalega jab "TRACKFIT" poora likh jayega
  const handleTypingComplete = () => {
    // Likhne ke baad user ko 0.8 seconds padhne ka time do, fir aage bhej do
    setTimeout(() => {
      navigate('/login');
    }, 800);
  };

  return (
    <div className="splash-container">
      <div className="splash-content">
        
        {/* Animated Scaling Logo */}
        <motion.div 
          className="logo-wrapper" 
          variants={logoVariants}
          initial="hidden"
          animate="show"
        >
          {/* Naya Logo Use Kiya Hai */}
          <img src={logo} alt="TrackFit Logo" className="splash-logo" />
        </motion.div>

        {/* Animated Typewriter Text */}
        <div className="text-mask">
          <motion.h1 
            variants={typingContainer}
            initial="hidden"
            animate="show"
            onAnimationComplete={handleTypingComplete} // Yahan catch kiya finish event
            className="typing-text"
          >
            {title.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants} className="letter">
                {char}
              </motion.span>
            ))}
            
            {/* Blinking Cursor (Bhaai ye detail app ko ekdum premium feel degi) */}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="cursor"
            >
              _
            </motion.span>
          </motion.h1>
        </div>

      </div>
    </div>
  );
};

export default Splash;