import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL CSS ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --black:  #0a0a0a;
    --white:  #fafafa;
    --gray:   #666666;
    --gray2:  #cccccc;
    --gray3:  #f0f0f0;
    --lime:   #d0ff00;
    --red:    #ff3b30;
    --font:   'IBM Plex Mono', monospace;
    --base:   8px;
    --radius: 12px;
  }
  
  html { overflow-y: scroll; }
  body {
    background: var(--white);
    color: var(--black);
    font-family: var(--font);
    font-size: 14px;
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
  }
  
  button { font-family: var(--font); cursor: pointer; border: none; background: none; }
  input, select, textarea { font-family: var(--font); border: none; outline: none; }
  
  .btn-primary {
    background: var(--black); color: var(--white); font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.5px;
    padding: calc(var(--base) * 2) calc(var(--base) * 3);
    font-size: 12px; border-radius: var(--radius); transition: all 0.15s;
  }
  .btn-primary:hover { background: #1a1a1a; transform: translateY(-1px); }
  .btn-primary:active { background: #000; transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  
  .btn-ghost {
    background: var(--white); color: var(--black); border: 1px solid var(--black);
    font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;
    padding: calc(var(--base) * 2) calc(var(--base) * 3);
    font-size: 12px; border-radius: var(--radius); transition: all 0.1s;
  }
  .btn-ghost:hover { background: #f0f0f0; }
  .btn-ghost:active { background: #e8e8e8; }
  
  .btn-icon {
    background: var(--white); border: 1px solid var(--black);
    width: 40px; height: 40px; border-radius: var(--radius);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; transition: all 0.1s;
  }
  .btn-icon:hover { background: var(--gray3); }
  .btn-icon:active { background: var(--gray2); }
  
  .input {
    width: 100%; background: var(--white); border: 1px solid var(--black);
    padding: calc(var(--base) * 2); font-size: 14px; font-weight: 500;
    border-radius: var(--radius);
  }
  .input::placeholder { color: var(--gray); }
  .input:focus { border-color: var(--lime); box-shadow: 0 0 0 2px rgba(208, 255, 0, 0.1); }
  
  .input-sm {
    width: 80px; background: var(--white); border: 1px solid var(--black);
    padding: calc(var(--base)) calc(var(--base) * 1.5);
    font-size: 13px; font-weight: 600; border-radius: var(--radius);
    text-align: center;
  }
  .input-sm:focus { border-color: var(--lime); }
  
  .label {
    font-size: 10px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 1px; color: var(--gray); margin-bottom: var(--base); display: block;
  }
  
  .card {
    border: 1px solid var(--black); background: var(--white);
    padding: calc(var(--base) * 3); border-radius: var(--radius);
  }
  
  .divider { height: 1px; background: var(--gray2); margin: calc(var(--base) * 3) 0; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(10, 10, 10, 0.7);
    backdrop-filter: blur(4px); z-index: 2000;
    display: flex; align-items: center; justify-content: center;
    padding: calc(var(--base) * 3); animation: fadeIn 0.2s ease;
  }

  .modal {
    background: var(--white); border: 1px solid var(--black);
    border-radius: calc(var(--radius) * 2); max-width: 500px; width: 100%;
    max-height: 90vh; overflow-y: auto;
    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .tab-bar {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
    background: var(--white); border-top: 1px solid var(--black);
    display: flex; padding: calc(var(--base) * 2) calc(var(--base) * 2) calc(var(--base) * 3);
    gap: var(--base);
  }

  .tab-btn {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    gap: 4px; padding: calc(var(--base) * 1.5); border-radius: var(--radius);
    transition: background 0.15s; font-size: 20px; background: none; border: none;
  }
  .tab-btn:active { background: var(--gray3); }
  .tab-btn.active { background: var(--lime); }
  .tab-label { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
`;

/* ─── WORKOUT TEMPLATES ─── */
const MUSCLE_GROUPS = {
  chest: { name: 'Chest', exercises: ['Bench Press', 'Incline Press', 'Chest Fly', 'Push-Up'] },
  back: { name: 'Back', exercises: ['Pull-Up', 'Bent Row', 'Lat Pulldown', 'Deadlift'] },
  shoulders: { name: 'Shoulders', exercises: ['Overhead Press', 'Lateral Raise', 'Front Raise', 'Face Pull'] },
  biceps: { name: 'Biceps', exercises: ['Barbell Curl', 'Hammer Curl', 'Preacher Curl'] },
  triceps: { name: 'Triceps', exercises: ['Dips', 'Tricep Extension', 'Close Grip Press'] },
  legs: { name: 'Legs', exercises: ['Squat', 'Leg Press', 'Lunge', 'Leg Curl', 'Calf Raise'] },
  core: { name: 'Core', exercises: ['Plank', 'Crunches', 'Leg Raises', 'Russian Twist'] }
};

const RECOMMENDED_SPLITS = [
  { name: 'Push/Pull/Legs', days: [
    { label: 'Push', groups: ['chest', 'shoulders', 'triceps'] },
    { label: 'Pull', groups: ['back', 'biceps'] },
    { label: 'Legs', groups: ['legs', 'core'] }
  ]},
  { name: 'Upper/Lower', days: [
    { label: 'Upper', groups: ['chest', 'back', 'shoulders', 'biceps', 'triceps'] },
    { label: 'Lower', groups: ['legs', 'core'] }
  ]},
  { name: 'Bro Split', days: [
    { label: 'Chest', groups: ['chest'] },
    { label: 'Back', groups: ['back'] },
    { label: 'Shoulders', groups: ['shoulders'] },
    { label: 'Arms', groups: ['biceps', 'triceps'] },
    { label: 'Legs', groups: ['legs'] }
  ]}
];

/* ─── CAMERA WITH GUIDANCE ─── */
function CameraWorkout({ exercise, sets, reps, onComplete, onSkip }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [direction, setDirection] = useState(null);
  const [showGuidance, setShowGuidance] = useState(true);
  const animationRef = useRef(null);

  useEffect(() => {
    startCamera();
    setTimeout(() => setShowGuidance(false), 5000);
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsTracking(true);
          detectMotion();
        };
      }
    } catch (err) {
      setError('Camera access denied');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const detectMotion = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let prevFrame = null;

    const processFrame = () => {
      if (!isTracking) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      if (prevFrame) {
        const motion = calculateMotion(prevFrame.data, currentFrame.data);
        updateRepCount(motion);
      }
      
      prevFrame = currentFrame;
      animationRef.current = requestAnimationFrame(processFrame);
    };

    processFrame();
  };

  const calculateMotion = (prev, curr) => {
    let yWeightedSum = 0;
    let motionPixels = 0;

    for (let i = 0; i < prev.length; i += 16) {
      const diff = Math.abs(prev[i] - curr[i]) +
                   Math.abs(prev[i+1] - curr[i+1]) +
                   Math.abs(prev[i+2] - curr[i+2]);
      
      if (diff > 30) {
        const pixelIndex = i / 4;
        const y = Math.floor(pixelIndex / canvasRef.current.width);
        yWeightedSum += y;
        motionPixels++;
      }
    }

    if (motionPixels > 100) {
      return { y: yWeightedSum / motionPixels };
    }
    return null;
  };

  const updateRepCount = (motion) => {
    if (!motion) return;
    const THRESHOLD = 20;

    if (lastY !== null) {
      const delta = motion.y - lastY;
      
      if (Math.abs(delta) > THRESHOLD) {
        const newDirection = delta < 0 ? 'up' : 'down';
        
        if (direction === 'up' && newDirection === 'down') {
          const newRep = currentRep + 1;
          setCurrentRep(newRep);
          
          if (newRep >= reps) {
            setTimeout(() => {
              if (currentSet < sets) {
                setCurrentSet(currentSet + 1);
                setCurrentRep(0);
              } else {
                onComplete();
              }
            }, 300);
          }
        }
        
        setDirection(newDirection);
      }
    }

    setLastY(motion.y);
  };

  const progressSet = (currentRep / reps);
  const progressTotal = ((currentSet - 1) * reps + currentRep) / (sets * reps);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--black)', color: 'var(--white)' }}>
      <div style={{ position: 'relative', height: '100%' }}>
        <video ref={videoRef} autoPlay playsInline muted
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Guidance Overlay */}
        {showGuidance && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 'calc(var(--base) * 4)', textAlign: 'center'
          }}>
            <div style={{ fontSize: 48, marginBottom: 'calc(var(--base) * 2)' }}>📍</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 'var(--base)', color: 'var(--lime)' }}>
              POSITIONING GUIDE
            </div>
            <div style={{ fontSize: 12, maxWidth: 300, lineHeight: 1.6, marginBottom: 'calc(var(--base) * 3)' }}>
              • Stand centered in frame<br/>
              • Full body visible<br/>
              • Good lighting<br/>
              • Clear background<br/>
              • Move through full range
            </div>
            <button
              onClick={() => setShowGuidance(false)}
              style={{
                background: 'var(--lime)', color: 'var(--black)', border: 'none',
                padding: 'calc(var(--base) * 2) calc(var(--base) * 4)',
                fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                borderRadius: 'var(--radius)'
              }}
            >
              Got it
            </button>
          </div>
        )}

        {/* Stats Overlay */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: 'calc(var(--base) * 4)',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 30%, transparent 70%, rgba(0,0,0,0.6))'
        }}>
          {/* Top info */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, opacity: 0.7 }}>
              {exercise}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1 }}>{currentRep}</div>
              <div style={{ fontSize: 24, opacity: 0.5 }}>/ {reps}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
              SET {currentSet} / {sets}
            </div>
            {direction && (
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--lime)' }}>
                {direction === 'up' ? '↑ UP' : '↓ DOWN'}
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div>
            {/* Set progress */}
            <div style={{ height: 3, background: 'rgba(255,255,255,0.2)', marginBottom: 6, overflow: 'hidden', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${progressSet * 100}%`, background: 'var(--lime)', transition: 'width 0.2s' }} />
            </div>

            {/* Total progress */}
            <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', marginBottom: 'calc(var(--base) * 2)', overflow: 'hidden', borderRadius: 3 }}>
              <div style={{ height: '100%', width: `${progressTotal * 100}%`, background: 'var(--lime)', transition: 'width 0.3s' }} />
            </div>

            <div style={{ display: 'flex', gap: 'var(--base)' }}>
              <button onClick={onSkip} style={{
                flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white',
                border: '1px solid rgba(255,255,255,0.3)', padding: 'calc(var(--base) * 2)',
                fontSize: 12, fontWeight: 600, textTransform: 'uppercase', borderRadius: 'var(--radius)'
              }}>
                Skip
              </button>
              {currentSet >= sets && currentRep >= reps && (
                <button onClick={onComplete} style={{
                  flex: 2, background: 'var(--lime)', color: 'var(--black)', border: 'none',
                  padding: 'calc(var(--base) * 2)', fontSize: 12, fontWeight: 700,
                  textTransform: 'uppercase', borderRadius: 'var(--radius)'
                }}>
                  Complete
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'var(--black)', border: '1px solid var(--lime)',
            padding: 'calc(var(--base) * 3)', maxWidth: 300, textAlign: 'center',
            borderRadius: 'calc(var(--radius) * 2)'
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 'var(--base)', color: 'var(--lime)' }}>ERROR</div>
            <div style={{ fontSize: 11, marginBottom: 'calc(var(--base) * 2)' }}>{error}</div>
            <button onClick={onSkip} className="btn-ghost" style={{ width: '100%', color: 'white', borderColor: 'white' }}>
              Skip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MANUAL WORKOUT WITH STOPWATCH ─── */
function ManualWorkout({ exercise, sets, reps, restTime, onComplete, onSkip }) {
  const [currentSet, setCurrentSet] = useState(1);
  const [mode, setMode] = useState('ready'); // ready | working | resting
  const [workTime, setWorkTime] = useState(0);
  const [restRemaining, setRestRemaining] = useState(restTime);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (mode === 'working') {
      intervalRef.current = setInterval(() => {
        setWorkTime(t => t + 0.1);
      }, 100);
    } else if (mode === 'resting') {
      intervalRef.current = setInterval(() => {
        setRestRemaining(t => {
          if (t <= 0.1) {
            clearInterval(intervalRef.current);
            handleNextSet();
            return restTime;
          }
          return t - 0.1;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mode]);

  const handleStartSet = () => {
    setWorkTime(0);
    setMode('working');
  };

  const handleFinishSet = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (currentSet < sets) {
      setMode('resting');
      setRestRemaining(restTime);
    } else {
      onComplete();
    }
  };

  const handleNextSet = () => {
    setCurrentSet(currentSet + 1);
    setMode('ready');
  };

  const handleSkipRest = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    handleNextSet();
  };

  const progress = (currentSet - 1) / sets;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: 'calc(var(--base) * 10)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--black)', padding: 'calc(var(--base) * 2) calc(var(--base) * 3)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 4 }}>
          Manual Mode
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 'var(--base)' }}>{exercise}</div>
        <div style={{ height: 4, background: 'var(--gray2)', overflow: 'hidden', borderRadius: 4 }}>
          <div style={{ height: '100%', width: `${progress * 100}%`, background: 'var(--black)', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'calc(var(--base) * 3)' }}>
        <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          {mode === 'ready' && (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 'calc(var(--base) * 2)', color: 'var(--gray)' }}>
                SET {currentSet} / {sets}
              </div>
              <div style={{ fontSize: 72, fontWeight: 700, marginBottom: 'calc(var(--base) * 2)' }}>
                {reps}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 'calc(var(--base) * 4)', color: 'var(--gray)' }}>
                TARGET REPS
              </div>
              <button className="btn-primary" onClick={handleStartSet} style={{ width: '100%', padding: 'calc(var(--base) * 3)' }}>
                Start Set
              </button>
            </>
          )}

          {mode === 'working' && (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 'calc(var(--base) * 2)', color: 'var(--lime)', animation: 'pulse 1.5s infinite' }}>
                ● WORKING
              </div>
              <div style={{ fontSize: 96, fontWeight: 700, marginBottom: 'calc(var(--base) * 2)', fontVariantNumeric: 'tabular-nums' }}>
                {workTime.toFixed(1)}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 'calc(var(--base) * 4)', color: 'var(--gray)' }}>
                SECONDS
              </div>
              <button className="btn-primary" onClick={handleFinishSet} style={{ width: '100%', padding: 'calc(var(--base) * 3)' }}>
                Finish Set
              </button>
            </>
          )}

          {mode === 'resting' && (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 'calc(var(--base) * 2)', color: 'var(--gray)' }}>
                REST PERIOD
              </div>
              <div style={{ fontSize: 96, fontWeight: 700, marginBottom: 'calc(var(--base) * 2)', fontVariantNumeric: 'tabular-nums' }}>
                {Math.ceil(restRemaining)}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 'calc(var(--base) * 4)', color: 'var(--gray)' }}>
                SECONDS REMAINING
              </div>
              <button className="btn-ghost" onClick={handleSkipRest} style={{ width: '100%' }}>
                Skip Rest
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom skip */}
      <div style={{ padding: 'calc(var(--base) * 3)', borderTop: '1px solid var(--gray2)' }}>
        <button className="btn-ghost" onClick={onSkip} style={{ width: '100%' }}>
          Skip Exercise
        </button>
      </div>
    </div>
  );
}

/* ─── WORKOUT PLANNER ─── */
function WorkoutPlanner({ onSave, onClose }) {
  const [step, setStep] = useState(0); // 0: choose split, 1: customize exercises
  const [selectedSplit, setSelectedSplit] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [customWorkouts, setCustomWorkouts] = useState([]);

  const handleSelectSplit = (split) => {
    setSelectedSplit(split);
    const initial = {};
    split.days.forEach((day, i) => {
      const exercises = [];
      day.groups.forEach(groupKey => {
        const group = MUSCLE_GROUPS[groupKey];
        group.exercises.slice(0, 3).forEach(ex => {
          exercises.push({ name: ex, sets: 3, reps: 10, rest: 60 });
        });
      });
      initial[i] = { label: day.label, exercises };
    });
    setCustomWorkouts(initial);
    setStep(1);
  };

  const handleSave = () => {
    onSave({ split: selectedSplit.name, workouts: customWorkouts });
  };

  const updateExercise = (dayIdx, exIdx, field, value) => {
    setCustomWorkouts(prev => ({
      ...prev,
      [dayIdx]: {
        ...prev[dayIdx],
        exercises: prev[dayIdx].exercises.map((ex, i) =>
          i === exIdx ? { ...ex, [field]: parseInt(value) || 0 } : ex
        )
      }
    }));
  };

  if (step === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div style={{ padding: 'calc(var(--base) * 4)', borderBottom: '1px solid var(--gray2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Choose Split</h2>
              <button className="btn-icon" onClick={onClose} style={{ border: 'none' }}>✕</button>
            </div>
          </div>
          <div style={{ padding: 'calc(var(--base) * 4)' }}>
            {RECOMMENDED_SPLITS.map(split => (
              <button
                key={split.name}
                onClick={() => handleSelectSplit(split)}
                className="card"
                style={{ width: '100%', marginBottom: 'calc(var(--base) * 2)', textAlign: 'left', cursor: 'pointer', padding: 'calc(var(--base) * 3)' }}
              >
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 'var(--base)' }}>{split.name}</div>
                <div style={{ fontSize: 11, color: 'var(--gray)' }}>
                  {split.days.map(d => d.label).join(' → ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div style={{ padding: 'calc(var(--base) * 4)', borderBottom: '1px solid var(--gray2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Customize Workouts</h2>
            <button className="btn-icon" onClick={() => setStep(0)} style={{ border: 'none' }}>←</button>
          </div>
        </div>
        <div style={{ padding: 'calc(var(--base) * 4)' }}>
          {Object.entries(customWorkouts).map(([dayIdx, workout]) => (
            <div key={dayIdx} style={{ marginBottom: 'calc(var(--base) * 4)' }}>
              <div className="label">{workout.label}</div>
              {workout.exercises.map((ex, exIdx) => (
                <div key={exIdx} className="card" style={{ marginBottom: 'var(--base)', padding: 'calc(var(--base) * 2)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 'var(--base)' }}>{ex.name}</div>
                  <div style={{ display: 'flex', gap: 'var(--base)', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 4 }}>Sets</div>
                      <input className="input-sm" type="number" value={ex.sets}
                        onChange={e => updateExercise(dayIdx, exIdx, 'sets', e.target.value)} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 4 }}>Reps</div>
                      <input className="input-sm" type="number" value={ex.reps}
                        onChange={e => updateExercise(dayIdx, exIdx, 'reps', e.target.value)} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 4 }}>Rest(s)</div>
                      <input className="input-sm" type="number" value={ex.rest}
                        onChange={e => updateExercise(dayIdx, exIdx, 'rest', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <button className="btn-primary" onClick={handleSave} style={{ width: '100%' }}>
            Save Program
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── SCHEDULE SCREEN ─── */
function ScheduleScreen({ program, onStartWorkout }) {
  const [selectedDay, setSelectedDay] = useState(null);

  if (!program) {
    return (
      <div style={{ minHeight: '100vh', padding: 'calc(var(--base) * 10) calc(var(--base) * 3) calc(var(--base) * 15)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 'calc(var(--base) * 3)' }}>📅</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 'var(--base)' }}>No Program Set</h1>
          <p style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 'calc(var(--base) * 4)' }}>
            Create a workout split in the Plan tab
          </p>
        </div>
      </div>
    );
  }

  const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div style={{ minHeight: '100vh', padding: 'calc(var(--base) * 10) calc(var(--base) * 3) calc(var(--base) * 15)' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: 'calc(var(--base) * 4)' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 'var(--base)' }}>Weekly Schedule</h1>
          <div style={{ fontSize: 12, color: 'var(--gray)' }}>{program.split}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--base)', marginBottom: 'calc(var(--base) * 4)' }}>
          {DAYS.map((day, i) => {
            const workout = program.workouts[i % Object.keys(program.workouts).length];
            const isRest = !workout;
            return (
              <button
                key={day}
                onClick={() => !isRest && setSelectedDay(i % Object.keys(program.workouts).length)}
                className={selectedDay === i % Object.keys(program.workouts).length ? 'card' : ''}
                style={{
                  padding: 'calc(var(--base) * 2)',
                  textAlign: 'center',
                  background: selectedDay === i % Object.keys(program.workouts).length ? 'var(--lime)' : 'var(--white)',
                  border: '1px solid var(--black)',
                  borderRadius: 'var(--radius)',
                  cursor: isRest ? 'default' : 'pointer'
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 4 }}>{day}</div>
                <div style={{ fontSize: 9, color: 'var(--gray)' }}>
                  {isRest ? 'Rest' : workout.label}
                </div>
              </button>
            );
          })}
        </div>

        {selectedDay !== null && program.workouts[selectedDay] && (
          <div className="card">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 'calc(var(--base) * 2)' }}>
              {program.workouts[selectedDay].label}
            </div>
            <div style={{ marginBottom: 'calc(var(--base) * 3)' }}>
              {program.workouts[selectedDay].exercises.map((ex, i) => (
                <div key={i} style={{ borderTop: i > 0 ? '1px solid var(--gray2)' : 'none', padding: 'var(--base) 0', fontSize: 12 }}>
                  <div style={{ fontWeight: 600 }}>{ex.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray)' }}>
                    {ex.sets} × {ex.reps} • {ex.rest}s rest
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => onStartWorkout(program.workouts[selectedDay])} style={{ width: '100%' }}>
              Start Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ACTIVE WORKOUT ─── */
function ActiveWorkout({ workout, onComplete }) {
  const [step, setStep] = useState('choose'); // choose | camera | manual
  const [currentExIdx, setCurrentExIdx] = useState(0);

  const handleExerciseComplete = () => {
    if (currentExIdx + 1 < workout.exercises.length) {
      setCurrentExIdx(currentExIdx + 1);
      setStep('choose');
    } else {
      onComplete({ completedAt: new Date(), workout: workout.label });
    }
  };

  const ex = workout.exercises[currentExIdx];

  if (step === 'choose') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'calc(var(--base) * 3)' }}>
        <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 'var(--base)' }}>
            Exercise {currentExIdx + 1} / {workout.exercises.length}
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 'calc(var(--base) * 2)' }}>{ex.name}</h1>
          <div style={{ fontSize: 14, color: 'var(--gray)', marginBottom: 'calc(var(--base) * 4)' }}>
            {ex.sets} sets × {ex.reps} reps • {ex.rest}s rest
          </div>
          <button className="btn-primary" onClick={() => setStep('camera')} style={{ width: '100%', marginBottom: 'var(--base)' }}>
            Use Camera
          </button>
          <button className="btn-ghost" onClick={() => setStep('manual')} style={{ width: '100%' }}>
            Manual Mode
          </button>
        </div>
      </div>
    );
  }

  if (step === 'camera') {
    return <CameraWorkout exercise={ex.name} sets={ex.sets} reps={ex.reps} onComplete={handleExerciseComplete} onSkip={handleExerciseComplete} />;
  }

  return <ManualWorkout exercise={ex.name} sets={ex.sets} reps={ex.reps} restTime={ex.rest} onComplete={handleExerciseComplete} onSkip={handleExerciseComplete} />;
}

/* ─── HOME ─── */
function Home({ user, history, onOpenSettings }) {
  return (
    <div style={{ minHeight: '100vh', padding: 'calc(var(--base) * 10) calc(var(--base) * 3) calc(var(--base) * 15)' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'calc(var(--base) * 6)' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 4 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>{user.name}</h1>
          </div>
          <button className="btn-icon" onClick={onOpenSettings}>⚙</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--base)', marginBottom: 'calc(var(--base) * 4)' }}>
          {[
            { label: 'Total', value: history.length },
            { label: 'This Week', value: history.filter(h => (Date.now() - new Date(h.completedAt)) < 7 * 86400000).length },
            { label: 'Streak', value: Math.min(history.length, 7) }
          ].map(stat => (
            <div key={stat.label} className="card" style={{ textAlign: 'center', padding: 'calc(var(--base) * 2)' }}>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 9, textTransform: 'uppercase', color: 'var(--gray)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {history.length > 0 && (
          <>
            <div className="label" style={{ marginBottom: 'calc(var(--base) * 2)' }}>Recent Sessions</div>
            {history.slice(-5).reverse().map((h, i) => (
              <div key={i} style={{ borderTop: '1px solid var(--gray2)', padding: 'calc(var(--base) * 2) 0', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    {new Date(h.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--gray)' }}>{h.workout}</div>
                </div>
                <div style={{ fontSize: 20 }}>✓</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── PLAN SCREEN ─── */
function PlanScreen({ program, onSaveProgram }) {
  const [showPlanner, setShowPlanner] = useState(false);

  return (
    <div style={{ minHeight: '100vh', padding: 'calc(var(--base) * 10) calc(var(--base) * 3) calc(var(--base) * 15)' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 'calc(var(--base) * 4)' }}>Program</h1>

        {!program ? (
          <div style={{ textAlign: 'center', padding: 'calc(var(--base) * 6) 0' }}>
            <div style={{ fontSize: 48, marginBottom: 'calc(var(--base) * 3)' }}>💪</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--base)' }}>No Program Set</div>
            <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 'calc(var(--base) * 4)' }}>
              Create a personalized workout split
            </div>
            <button className="btn-primary" onClick={() => setShowPlanner(true)}>
              Create Program
            </button>
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 'calc(var(--base) * 3)' }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 'var(--base)' }}>{program.split}</div>
              <div style={{ fontSize: 11, color: 'var(--gray)' }}>
                {Object.values(program.workouts).map(w => w.label).join(' • ')}
              </div>
            </div>
            <button className="btn-ghost" onClick={() => setShowPlanner(true)} style={{ width: '100%' }}>
              Edit Program
            </button>
          </>
        )}

        {showPlanner && <WorkoutPlanner onSave={p => { onSaveProgram(p); setShowPlanner(false); }} onClose={() => setShowPlanner(false)} />}
      </div>
    </div>
  );
}

/* ─── SETTINGS ─── */
function SettingsModal({ user, onSave, onClose, onLogout }) {
  const [name, setName] = useState(user.name);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding: 'calc(var(--base) * 4)', borderBottom: '1px solid var(--gray2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Settings</h2>
            <button className="btn-icon" onClick={onClose} style={{ border: 'none' }}>✕</button>
          </div>
        </div>
        <div style={{ padding: 'calc(var(--base) * 4)' }}>
          <div style={{ marginBottom: 'calc(var(--base) * 4)' }}>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={() => { onSave({ ...user, name }); onClose(); }} style={{ width: '100%', marginBottom: 'var(--base)' }}>
            Save
          </button>
          <button className="btn-ghost" onClick={onLogout} style={{ width: '100%', color: 'var(--gray)', borderColor: 'var(--gray2)' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ONBOARDING ─── */
function Onboarding({ onComplete }) {
  const [name, setName] = useState('');

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 'calc(var(--base) * 10) calc(var(--base) * 3)' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 'calc(var(--base) * 6)' }}>Welcome to GymBro</h1>
      <input className="input" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && name.trim() && onComplete({ name: name.trim() })}
        style={{ marginBottom: 'calc(var(--base) * 2)' }} autoFocus />
      <button className="btn-primary" onClick={() => onComplete({ name: name.trim() })} disabled={!name.trim()} style={{ width: '100%' }}>
        Start
      </button>
    </div>
  );
}

/* ─── ROOT ─── */
export default function GymBro() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gymbro_user')); } catch { return null; }
  });

  const [program, setProgram] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gymbro_program')); } catch { return null; }
  });

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gymbro_history')) || []; } catch { return []; }
  });

  const [tab, setTab] = useState('home');
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleOnboard = (u) => {
    localStorage.setItem('gymbro_user', JSON.stringify(u));
    setUser(u);
  };

  const handleSaveProgram = (p) => {
    localStorage.setItem('gymbro_program', JSON.stringify(p));
    setProgram(p);
  };

  const handleCompleteWorkout = (session) => {
    const newHistory = [...history, session];
    localStorage.setItem('gymbro_history', JSON.stringify(newHistory));
    setHistory(newHistory);
    setActiveWorkout(null);
    setTab('home');
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setProgram(null);
    setHistory([]);
    setShowSettings(false);
  };

  if (!user) return (
    <>
      <style>{CSS}</style>
      <Onboarding onComplete={handleOnboard} />
    </>
  );

  if (activeWorkout) return (
    <>
      <style>{CSS}</style>
      <ActiveWorkout workout={activeWorkout} onComplete={handleCompleteWorkout} />
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      {showSettings && <SettingsModal user={user} onSave={u => { localStorage.setItem('gymbro_user', JSON.stringify(u)); setUser(u); }} onClose={() => setShowSettings(false)} onLogout={handleLogout} />}
      {tab === 'home' && <Home user={user} history={history} onOpenSettings={() => setShowSettings(true)} />}
      {tab === 'schedule' && <ScheduleScreen program={program} onStartWorkout={w => setActiveWorkout(w)} />}
      {tab === 'plan' && <PlanScreen program={program} onSaveProgram={handleSaveProgram} />}

      <div className="tab-bar">
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'schedule', icon: '📅', label: 'Schedule' },
          { id: 'plan', icon: '📋', label: 'Plan' }
        ].map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <div>{t.icon}</div>
            <div className="tab-label">{t.label}</div>
          </button>
        ))}
      </div>
    </>
  );
}