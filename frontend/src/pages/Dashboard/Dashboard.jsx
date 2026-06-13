// src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// FiActivity hata diya, sirf FiLogOut rakha hai
import { FiLogOut } from 'react-icons/fi'; 
import './Dashboard.scss';
import logo from '../../assets/logo.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [dateContext, setDateContext] = useState(new Date());
  
  const [ripples, setRipples] = useState([]);
  const [bubble, setBubble] = useState({ active: false, x: 0, y: 0 });

  useEffect(() => {
    const data = localStorage.getItem('trackfit_user');
    if (data) setUserData(JSON.parse(data));
    else navigate('/login');
  }, [navigate]);

  const nextMonth = () => setDateContext(new Date(dateContext.getFullYear(), dateContext.getMonth() + 1, 1));
  const prevMonth = () => setDateContext(new Date(dateContext.getFullYear(), dateContext.getMonth() - 1, 1));

  // No-Scroll Calendar Logic (42 boxes)
  const daysInMonth = new Date(dateContext.getFullYear(), dateContext.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(dateContext.getFullYear(), dateContext.getMonth(), 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const trailingBlanks = Array.from({ length: 42 - blanks.length - daysArray.length }, (_, i) => i);

  const handleDateClick = (e, day) => {
    if (!day) return;
    const { clientX, clientY } = e;
    
    const newRipple = { id: Date.now(), x: clientX, y: clientY };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => setRipples((prev) => prev.filter(r => r.id !== newRipple.id)), 1000);

    localStorage.setItem('trackfit_selected_date', `${day} ${dateContext.toLocaleString('default', { month: 'short' })}`);
    setTimeout(() => setBubble({ active: true, x: clientX, y: clientY }), 300);
    setTimeout(() => navigate('/agenda'), 900);
  };

  const handleLogout = () => {
    localStorage.removeItem('trackfit_user');
    localStorage.removeItem('trackfit_token'); // Clean token on logout too
    navigate('/login');
  };

  // --- NAYA BMI CALCULATOR FUNCTION ---
  const getBMI = () => {
    // Agar BMI already data me hai aur valid hai, to wahi dikhao
    if (userData?.bmi && userData.bmi !== 'NaN' && userData.bmi !== 'NAN') {
      return userData.bmi;
    }
    // Agar nahi hai, to weight aur height se calculate kar lo
    if (userData?.weight && userData?.height) {
      const hInMeters = userData.height / 100;
      return (userData.weight / (hInMeters * hInMeters)).toFixed(1);
    }
    return '--';
  };

  if (!userData) return <div className="loading">LOADING...</div>;

  return (
    <div className="dashboard-container">
      
      {/* Interaction Effects */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="water-ripple"
          initial={{ top: ripple.y, left: ripple.x, scale: 0, opacity: 0.8 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}

      {bubble.active && (
        <motion.div 
          className="bubble-overlay"
          initial={{ width: 0, height: 0, top: bubble.y, left: bubble.x }}
          animate={{ width: '300vw', height: '300vw' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        />
      )}

      {/* MAIN CONTENT (Strictly 100vh) */}
      <div className="dashboard-content">
        
        {/* --- TOP NAV --- */}
        <nav className="top-nav">
          <div className="logo-wrapper">
            {/* <img src={logo} alt="TrackFit" className="nav-logo" /> */}
          </div>
          
          <div className="month-selector">
            <button onClick={prevMonth} className="icon-arrow">&#8592;</button>
            <div className="month-text">
              <h2>{dateContext.toLocaleString('default', { month: 'long' })}</h2>
              <span>{dateContext.getFullYear()}</span>
            </div>
            <button onClick={nextMonth} className="icon-arrow">&#8594;</button>
          </div>
        </nav>

        {/* --- METRICS HUD --- */}
        <div className="metrics-hud">
          <div className="hud-block profile-block">
            <span className="label">ATHLETE</span>
            <h3>{userData.name || 'USER'}</h3>
          </div>
          <div className="hud-divider"></div>
          <div className="hud-block">
            <span className="label">BMI STATUS</span>
            {/* Ab yahan apna naya function lag gaya */}
            <h3>{getBMI()}</h3>
          </div>
          <div className="hud-divider"></div>
          <div className="hud-block">
            <span className="label">MISSION</span>
            <h3 className="highlight">{userData.goal === 'loss' ? 'WEIGHT LOSS' : 'WEIGHT GAIN'}</h3>
          </div>
          <div className="hud-actions">
            {/* Puraane button ko hata diya, ab sirf yehi dikhega */}
            <button className="action-btn icon-btn logout" onClick={handleLogout} title="Logout">
              <FiLogOut />
            </button>
          </div>
        </div>

        {/* --- CALENDAR SECTION --- */}
        <div className="calendar-section">
          <div className="weekdays">
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>
          
          <div className="days-grid">
            {blanks.map((blank) => <div key={`blank-${blank}`} className="day-box empty"></div>)}
            
            {daysArray.map((day) => {
              const isToday = day === new Date().getDate() && dateContext.getMonth() === new Date().getMonth();
              const isPast = day < new Date().getDate() && dateContext.getMonth() === new Date().getMonth();
              const isWeekend = new Date(dateContext.getFullYear(), dateContext.getMonth(), day).getDay() % 6 === 0;

              let statusClass = 'upcoming';
              if (isToday) statusClass = 'today';
              else if (isPast && !isWeekend) statusClass = 'completed';
              else if (isWeekend) statusClass = 'rest';

              return (
                <div 
                  key={day}
                  className={`day-box ${statusClass}`}
                  onClick={(e) => handleDateClick(e, day)}
                >
                  <span className="date-num">{day}</span>
                  {statusClass === 'completed' && <span className="dot check"></span>}
                  {statusClass === 'today' && <span className="dot current"></span>}
                </div>
              );
            })}

            {trailingBlanks.map((blank) => <div key={`trailing-${blank}`} className="day-box empty"></div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;