// src/pages/Agenda/Agenda.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiPlus, FiCheck, FiPlay, FiX, FiEdit2, FiMinus } from 'react-icons/fi';
import { WARMUP_EXERCISES, getRecommendedWorkouts } from '../../utils/workouts';
import './Agenda.scss';

const Agenda = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [dateStr, setDateStr] = useState('');
  
  const [workoutMode, setWorkoutMode] = useState('build');
  const [recommended, setRecommended] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState([]);
  const [customInput, setCustomInput] = useState('');
  
  const [editingExId, setEditingExId] = useState(null);

  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const fullRoutine = [...WARMUP_EXERCISES, ...selectedRoutine];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('trackfit_user'));
    const selectedD = localStorage.getItem('trackfit_selected_date');
    if (!data || !selectedD) return navigate('/dashboard');
    
    setUserData(data);
    setDateStr(selectedD);
    
    const savedRoutine = JSON.parse(localStorage.getItem('trackfit_weekly_routine'));
    if (savedRoutine && savedRoutine.length > 0) {
      setSelectedRoutine(savedRoutine);
      setWorkoutMode('locked');
    } else {
      setRecommended(getRecommendedWorkouts(data.goal, parseFloat(data.bmi)));
    }
  }, [navigate]);

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6); 
    } catch (e) {}
  };

  useEffect(() => {
    let timer;
    if (workoutMode === 'active' && !isPaused && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (workoutMode === 'active' && timeLeft === 0 && !isPaused) {
      playBeep();
      const currentExercise = fullRoutine[currentExIndex];
      
      if (!isResting) {
        setIsResting(true);
        setTimeLeft(currentExercise.restTime || 30);
      } else {
        if (currentExIndex + 1 < fullRoutine.length) {
          setIsResting(false);
          setCurrentExIndex(prev => prev + 1);
          setTimeLeft(fullRoutine[currentExIndex + 1].activeTime || 45);
        } else {
          alert("BOOM! Workout Complete! Amazing job.");
          setWorkoutMode('locked');
        }
      }
    }
    return () => clearInterval(timer);
  }, [workoutMode, timeLeft, isPaused, isResting, currentExIndex, fullRoutine]);

  if (!userData) return null;

  // --- DYNAMIC STRICT TIME LOGIC ---
  // Using workoutTime from Onboarding, fallback to 60 if not found
  const totalTime = parseInt(userData.workoutTime) || parseInt(userData.time) || 60; 
  const mainTime = totalTime - 15; // 15 mins reserved for warmup
  
  const getExTimeInMins = (ex) => {
    const totalSeconds = ((ex.activeTime || 0) + (ex.restTime || 0)) * (ex.sets || 1);
    return Math.ceil(totalSeconds / 60);
  };

  const usedTime = selectedRoutine.reduce((total, ex) => total + getExTimeInMins(ex), 0);
  const timeRemaining = mainTime - usedTime;

  const toggleExerciseSelection = (exercise) => {
    setSelectedRoutine(prev => {
      const exists = prev.find(e => e.id === exercise.id);
      if (exists) {
        return prev.filter(e => e.id !== exercise.id);
      } else {
        const exTime = getExTimeInMins(exercise);
        if (timeRemaining <= 0 || timeRemaining - exTime < 0) {
          alert(`Limit Reached! This takes ${exTime} mins, but you only have ${Math.max(0, timeRemaining)} mins left.`);
          return prev;
        }
        return [...prev, exercise];
      }
    });
  };

  const updateExProp = (exId, prop, amount, e) => {
    e.stopPropagation(); 
    
    let targetEx = recommended.find(ex => ex.id === exId) || selectedRoutine.find(ex => ex.id === exId);
    if (!targetEx) return;

    let newValue = Math.max(1, targetEx[prop] + amount);
    if(prop === 'restTime' && newValue < 5) newValue = 5; 
    if(prop === 'activeTime' && newValue < 10) newValue = 10; 

    const newEx = { ...targetEx, [prop]: newValue };
    if (prop === 'activeTime') newEx.reps = `${newEx.activeTime}s`;

    const isSelected = selectedRoutine.some(ex => ex.id === exId);
    if (isSelected && amount > 0) {
      const oldTime = getExTimeInMins(targetEx);
      const newTime = getExTimeInMins(newEx);
      if (timeRemaining - (newTime - oldTime) < 0) {
        alert("Not enough time left to increase this! Remove an exercise first.");
        return;
      }
    }

    const updater = (list) => list.map(ex => ex.id === exId ? newEx : ex);
    setRecommended(updater);
    setSelectedRoutine(updater);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    
    const newEx = { 
      id: `custom-${Date.now()}`, name: customInput, type: 'Custom', 
      sets: 3, reps: '45s', activeTime: 45, restTime: 30 
    };

    const exTime = getExTimeInMins(newEx);
    if (timeRemaining - exTime < 0) {
      alert(`Limit Reached! Needs ${exTime} mins.`);
      return;
    }

    setSelectedRoutine(prev => [...prev, newEx]);
    setRecommended(prev => [...prev, newEx]);
    setCustomInput('');
  };

  const lockRoutine = () => {
    if (timeRemaining > 0) return; 
    localStorage.setItem('trackfit_weekly_routine', JSON.stringify(selectedRoutine));
    setWorkoutMode('locked');
  };

  const startLiveWorkout = () => {
    setCurrentExIndex(0);
    setIsResting(false);
    setTimeLeft(fullRoutine[0].activeTime || 40);
    setWorkoutMode('active');
  };

  if (workoutMode === 'active') {
    const currentEx = fullRoutine[currentExIndex];
    return (
      <div className="agenda-container live-workout-mode">
        <div className="live-header">
          <button className="quit-btn" onClick={() => setWorkoutMode('locked')}><FiX /></button>
          <span>{currentExIndex + 1} / {fullRoutine.length}</span>
        </div>
        <motion.div className="timer-container" key={`${currentExIndex}-${isResting}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <h2 className={isResting ? 'rest-text' : 'active-text'}>{isResting ? 'REST' : 'WORK'}</h2>
          <div className="time-display">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
          <h1 className="exercise-name">{isResting ? `Next: ${fullRoutine[currentExIndex + 1]?.name || 'Finish!'}` : currentEx.name}</h1>
          {!isResting && <span className="reps-target">Target: {currentEx.sets} Sets x {currentEx.reps}</span>}
        </motion.div>
        <div className="controls">
          <button className="pause-btn" onClick={() => setIsPaused(!isPaused)}>{isPaused ? 'RESUME' : 'PAUSE'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}><FiChevronLeft /></button>
          <div className="header-text">
            <h1>{dateStr}</h1>
            <span>{totalTime} Mins Total</span>
          </div>
        </div>
        
        {workoutMode === 'locked' && (
          <button className="start-workout-btn" onClick={startLiveWorkout}>
            <FiPlay className="play-icon" /> START
          </button>
        )}
      </div>

      <div className="agenda-content">
        <section className="workout-section warmup-section">
          <div className="section-header">
            <h2>Warmup Phase</h2>
          </div>
          <div className="exercise-list">
            {WARMUP_EXERCISES.map((ex) => (
              <div key={ex.id} className="exercise-card locked">
                <div className="ex-details">
                  <div className="ex-title-row">
                    <h4>{ex.name}</h4>
                    <span className="ex-duration">{getExTimeInMins(ex)} Min</span>
                  </div>
                  <span className="tags">{ex.activeTime}s Active • {ex.restTime}s Rest</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="workout-section main-section">
          <div className="section-header">
            <h2>Main Routine</h2>
            <span className={`time-badge ${timeRemaining === 0 ? 'success' : 'primary'}`}>
              {workoutMode === 'build' ? (timeRemaining === 0 ? 'READY TO LOCK' : `${timeRemaining} MINS LEFT`) : 'LOCKED'}
            </span>
          </div>

          {workoutMode === 'build' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="build-mode">
              
              <div className="exercise-list">
                {recommended.map((ex) => {
                  const isSelected = selectedRoutine.find(e => e.id === ex.id);
                  const isEditing = editingExId === ex.id;
                  
                  return (
                    <div key={ex.id} className={`exercise-card selectable ${isSelected ? 'selected' : ''}`} onClick={() => toggleExerciseSelection(ex)}>
                      
                      <div className="ex-main-row">
                        <div className="ex-details">
                          <div className="ex-title-row">
                            <h4>{ex.name}</h4>
                            <span className="ex-duration">{getExTimeInMins(ex)} Min</span>
                          </div>
                          <span className="tags">{ex.sets} Sets • {ex.activeTime}s Active • {ex.restTime}s Rest</span>
                        </div>
                        
                        <div className="ex-controls">
                          <button className="edit-icon-btn" onClick={(e) => { e.stopPropagation(); setEditingExId(isEditing ? null : ex.id); }}>
                            <FiEdit2 />
                          </button>
                          <div className="checkbox">{isSelected && <FiCheck />}</div>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="ex-editor-panel" onClick={e => e.stopPropagation()}>
                          <div className="edit-row">
                            <span className="edit-label">Sets</span>
                            <div className="edit-controls">
                              <button onClick={(e) => updateExProp(ex.id, 'sets', -1, e)}><FiMinus/></button>
                              <span>{ex.sets}</span>
                              <button onClick={(e) => updateExProp(ex.id, 'sets', 1, e)}><FiPlus/></button>
                            </div>
                          </div>
                          <div className="edit-row">
                            <span className="edit-label">Active (Sec)</span>
                            <div className="edit-controls">
                              <button onClick={(e) => updateExProp(ex.id, 'activeTime', -5, e)}><FiMinus/></button>
                              <span>{ex.activeTime}</span>
                              <button onClick={(e) => updateExProp(ex.id, 'activeTime', 5, e)}><FiPlus/></button>
                            </div>
                          </div>
                          <div className="edit-row">
                            <span className="edit-label">Rest (Sec)</span>
                            <div className="edit-controls">
                              <button onClick={(e) => updateExProp(ex.id, 'restTime', -5, e)}><FiMinus/></button>
                              <span>{ex.restTime}</span>
                              <button onClick={(e) => updateExProp(ex.id, 'restTime', 5, e)}><FiPlus/></button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              <form className="custom-input-wrapper" onSubmit={handleAddCustom}>
                <input type="text" placeholder="Add custom exercise..." value={customInput} onChange={(e) => setCustomInput(e.target.value)} />
                <button type="submit"><FiPlus /></button>
              </form>
              
              <button 
                className={`lock-btn ${timeRemaining > 0 ? 'disabled' : ''}`} 
                onClick={lockRoutine}
                disabled={timeRemaining > 0}
              >
                {timeRemaining > 0 ? `Fill ${timeRemaining} more mins to lock` : 'Lock Routine'}
              </button>

            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="active-mode">
              <div className="exercise-list">
                {selectedRoutine.map((ex) => (
                  <div key={ex.id} className="exercise-card actionable">
                    <div className="ex-details">
                      <div className="ex-title-row">
                        <h4>{ex.name}</h4>
                        <span className="ex-duration">{getExTimeInMins(ex)} Min</span>
                      </div>
                      <span className="tags">{ex.sets} Sets • {ex.activeTime}s Active • {ex.restTime}s Rest</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="weekly-notice">
                <p>Routine locked. Click START on top right!</p>
                <button className="text-btn" onClick={() => {
                  localStorage.removeItem('trackfit_weekly_routine');
                  setSelectedRoutine([]);
                  setWorkoutMode('build');
                }}>Change Routine</button>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Agenda;