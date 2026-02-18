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
    --lime:   #d0ff00;
    --font:   'IBM Plex Mono', monospace;
    --base:   8px;
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
  
  button {
    font-family: var(--font);
    cursor: pointer;
    border: none;
    background: none;
  }
  
  input {
    font-family: var(--font);
    border: none;
    outline: none;
  }
  
  .btn-primary {
    background: var(--black);
    color: var(--white);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: calc(var(--base) * 2) calc(var(--base) * 3);
    font-size: 12px;
    transition: background 0.15s;
  }
  .btn-primary:hover { background: #1a1a1a; }
  .btn-primary:active { background: #000; }
  
  .btn-ghost {
    background: var(--white);
    color: var(--black);
    border: 1px solid var(--black);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: calc(var(--base) * 2) calc(var(--base) * 3);
    font-size: 12px;
    transition: background 0.1s;
  }
  .btn-ghost:hover { background: #f0f0f0; }
  .btn-ghost:active { background: #e8e8e8; }
  
  .input {
    width: 100%;
    background: var(--white);
    border: 1px solid var(--black);
    padding: calc(var(--base) * 2);
    font-size: 14px;
    font-weight: 500;
  }
  .input::placeholder { color: var(--gray); }
  .input:focus { border-color: var(--lime); }
  
  .label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--gray);
    margin-bottom: var(--base);
    display: block;
  }
  
  .card {
    border: 1px solid var(--black);
    background: var(--white);
    padding: calc(var(--base) * 3);
  }
  
  .divider {
    height: 1px;
    background: var(--gray2);
    margin: calc(var(--base) * 3) 0;
  }
`;

/* ─── CAMERA REP COUNTER ─── */
function CameraCounter({ exercise, targetReps, onComplete, onSkip }) {
  const videoRef = useRef(null);
  const [reps, setReps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [direction, setDirection] = useState(null); // 'up' or 'down'
  const animationRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
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
      setError('Camera access denied or unavailable');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
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
    let totalMotion = 0;
    let yWeightedSum = 0;
    let motionPixels = 0;

    // Sample every 4th pixel for performance
    for (let i = 0; i < prev.length; i += 16) {
      const diff = Math.abs(prev[i] - curr[i]) +
                   Math.abs(prev[i+1] - curr[i+1]) +
                   Math.abs(prev[i+2] - curr[i+2]);
      
      if (diff > 30) { // motion threshold
        const pixelIndex = i / 4;
        const y = Math.floor(pixelIndex / canvasRef.current.width);
        yWeightedSum += y;
        motionPixels++;
        totalMotion += diff;
      }
    }

    if (motionPixels > 100) { // minimum motion pixels
      const avgY = yWeightedSum / motionPixels;
      return { intensity: totalMotion, y: avgY };
    }
    return null;
  };

  const updateRepCount = (motion) => {
    if (!motion) return;

    const THRESHOLD = 20; // pixels moved to count as direction change

    if (lastY !== null) {
      const delta = motion.y - lastY;
      
      if (Math.abs(delta) > THRESHOLD) {
        const newDirection = delta < 0 ? 'up' : 'down';
        
        // Rep counted on downward motion after upward motion (one complete cycle)
        if (direction === 'up' && newDirection === 'down') {
          setReps(r => {
            const newReps = r + 1;
            if (newReps >= targetReps) {
              setTimeout(() => onComplete(), 300);
            }
            return newReps;
          });
        }
        
        setDirection(newDirection);
      }
    }

    setLastY(motion.y);
  };

  const progress = Math.min(reps / targetReps, 1);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'var(--black)', color: 'var(--white)',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Video feed */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)' // mirror
          }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Overlay UI */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'calc(var(--base) * 4)',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)'
        }}>
          {/* Top info */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, opacity: 0.7 }}>
              {exercise}
            </div>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font)' }}>
              {reps}<span style={{ fontSize: 32, opacity: 0.5 }}>/{targetReps}</span>
            </div>
            {direction && (
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', marginTop: 8, color: 'var(--lime)' }}>
                {direction === 'up' ? '↑ UP' : '↓ DOWN'}
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div>
            {/* Progress bar */}
            <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', marginBottom: 'calc(var(--base) * 2)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progress * 100}%`,
                background: 'var(--lime)',
                transition: 'width 0.3s ease'
              }} />
            </div>

            <div style={{ display: 'flex', gap: 'var(--base)' }}>
              <button
                onClick={onSkip}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: 'calc(var(--base) * 2)',
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}
              >
                Skip
              </button>
              {reps >= targetReps && (
                <button
                  onClick={onComplete}
                  style={{
                    flex: 2,
                    background: 'var(--lime)',
                    color: 'var(--black)',
                    border: 'none',
                    padding: 'calc(var(--base) * 2)',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                  }}
                >
                  Complete Set
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--black)',
            border: '1px solid var(--lime)',
            padding: 'calc(var(--base) * 3)',
            maxWidth: 300,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 'var(--base)', color: 'var(--lime)' }}>
              CAMERA ERROR
            </div>
            <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 'calc(var(--base) * 2)' }}>
              {error}
            </div>
            <button onClick={onSkip} className="btn-ghost" style={{ width: '100%', color: 'var(--white)', borderColor: 'var(--white)' }}>
              Skip Set
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ONBOARDING ─── */
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [env, setEnv] = useState(null);

  const handleDone = () => {
    if (!name.trim() || !env) return;
    onComplete({ name: name.trim(), environment: env });
  };

  if (step === 0) {
    return (
      <div style={{ maxWidth: 400, margin: '0 auto', padding: 'calc(var(--base) * 10) calc(var(--base) * 3)' }}>
        <div style={{ marginBottom: 'calc(var(--base) * 6)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 'var(--base)' }}>
            Step 1/2
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 'calc(var(--base) * 2)', lineHeight: 1.1 }}>
            What's your name?
          </h1>
        </div>
        <input
          className="input"
          placeholder="ENTER NAME"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(1)}
          autoFocus
          style={{ marginBottom: 'calc(var(--base) * 2)' }}
        />
        <button className="btn-primary" onClick={() => setStep(1)} disabled={!name.trim()} style={{ width: '100%' }}>
          Next
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 'calc(var(--base) * 10) calc(var(--base) * 3)' }}>
      <div style={{ marginBottom: 'calc(var(--base) * 6)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 'var(--base)' }}>
          Step 2/2
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 'calc(var(--base) * 2)', lineHeight: 1.1 }}>
          Training environment?
        </h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--base)', marginBottom: 'calc(var(--base) * 2)' }}>
        {[
          { value: 'gym', label: 'GYM', desc: 'Full equipment' },
          { value: 'home', label: 'HOME', desc: 'Bodyweight only' }
        ].map(opt => (
          <button
            key={opt.value}
            className="btn-ghost"
            onClick={() => setEnv(opt.value)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: 'calc(var(--base) * 2)',
              background: env === opt.value ? 'var(--black)' : 'var(--white)',
              color: env === opt.value ? 'var(--white)' : 'var(--black)',
              borderColor: 'var(--black)'
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{opt.label}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>{opt.desc}</div>
          </button>
        ))}
      </div>
      <button className="btn-primary" onClick={handleDone} disabled={!env} style={{ width: '100%', marginBottom: 'var(--base)' }}>
        Start
      </button>
      <button className="btn-ghost" onClick={() => setStep(0)} style={{ width: '100%' }}>
        Back
      </button>
    </div>
  );
}

/* ─── WORKOUT DATA ─── */
const EXERCISES = {
  gym: [
    { name: 'Squat', reps: '8-10', rest: 90 },
    { name: 'Bench Press', reps: '8-10', rest: 90 },
    { name: 'Deadlift', reps: '6-8', rest: 120 },
    { name: 'Pull-Up', reps: '6-8', rest: 60 },
    { name: 'Overhead Press', reps: '8-10', rest: 75 },
  ],
  home: [
    { name: 'Push-Up', reps: '12-15', rest: 60 },
    { name: 'Bodyweight Squat', reps: '15-20', rest: 60 },
    { name: 'Plank', reps: '45s', rest: 45 },
    { name: 'Lunge', reps: '12 each', rest: 60 },
    { name: 'Pike Push-Up', reps: '10-12', rest: 60 },
  ]
};

/* ─── WORKOUT SESSION ─── */
function WorkoutSession({ user, onComplete }) {
  const exercises = EXERCISES[user.environment];
  const [currentEx, setCurrentEx] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [completedSets, setCompletedSets] = useState({});

  const ex = exercises[currentEx];
  const sets = 3;
  const targetReps = parseInt(ex.reps) || 10;

  const handleSetComplete = () => {
    const key = `${currentEx}-${currentSet}`;
    setCompletedSets({ ...completedSets, [key]: true });
    setShowCamera(false);

    if (currentSet + 1 < sets) {
      setCurrentSet(currentSet + 1);
    } else if (currentEx + 1 < exercises.length) {
      setCurrentEx(currentEx + 1);
      setCurrentSet(0);
    } else {
      onComplete({ completedAt: new Date(), total: exercises.length * sets });
    }
  };

  const progress = ((currentEx * sets + currentSet) / (exercises.length * sets)) * 100;

  if (showCamera) {
    return (
      <CameraCounter
        exercise={ex.name}
        targetReps={targetReps}
        onComplete={handleSetComplete}
        onSkip={handleSetComplete}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--black)', padding: 'calc(var(--base) * 2) calc(var(--base) * 3)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 4 }}>
          Exercise {currentEx + 1}/{exercises.length}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 'var(--base)' }}>
          {ex.name}
        </div>
        <div style={{ height: 4, background: 'var(--gray2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--black)', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 'calc(var(--base) * 3)' }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          {/* Set info */}
          <div className="card" style={{ marginBottom: 'calc(var(--base) * 3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'calc(var(--base) * 2)' }}>
              <div>
                <div className="label">Set</div>
                <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{currentSet + 1}/{sets}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="label">Target Reps</div>
                <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{ex.reps}</div>
              </div>
            </div>
            <div className="divider" />
            <div>
              <div className="label">Rest</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{ex.rest}s</div>
            </div>
          </div>

          {/* Set dots */}
          <div style={{ display: 'flex', gap: 'var(--base)', marginBottom: 'calc(var(--base) * 4)' }}>
            {Array.from({ length: sets }).map((_, i) => {
              const key = `${currentEx}-${i}`;
              const isDone = completedSets[key];
              const isCurrent = i === currentSet;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 8,
                    background: isDone ? 'var(--black)' : isCurrent ? 'var(--lime)' : 'var(--gray2)',
                    transition: 'background 0.2s'
                  }}
                />
              );
            })}
          </div>

          {/* Actions */}
          <button
            className="btn-primary"
            onClick={() => setShowCamera(true)}
            style={{ width: '100%', marginBottom: 'var(--base)', padding: 'calc(var(--base) * 3)' }}
          >
            Start Set with Camera
          </button>
          <button
            className="btn-ghost"
            onClick={handleSetComplete}
            style={{ width: '100%' }}
          >
            Complete Without Camera
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── HOME ─── */
function Home({ user, onStartWorkout, history }) {
  return (
    <div style={{ minHeight: '100vh', padding: 'calc(var(--base) * 10) calc(var(--base) * 3)' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'calc(var(--base) * 6)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 'var(--base)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 'var(--base)' }}>
            {user.name}
          </h1>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--gray)' }}>
            {user.environment === 'gym' ? 'GYM MODE' : 'HOME MODE'}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--base)', marginBottom: 'calc(var(--base) * 4)' }}>
          {[
            { label: 'Total', value: history.length },
            { label: 'This Week', value: history.filter(h => (Date.now() - new Date(h.completedAt)) < 7 * 86400000).length },
            { label: 'Streak', value: Math.min(history.length, 7) }
          ].map(stat => (
            <div key={stat.label} className="card" style={{ textAlign: 'center', padding: 'calc(var(--base) * 2)' }}>
              <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--gray)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="btn-primary"
          onClick={onStartWorkout}
          style={{ width: '100%', padding: 'calc(var(--base) * 4)', fontSize: 14 }}
        >
          Start Workout
        </button>

        {/* History */}
        {history.length > 0 && (
          <div style={{ marginTop: 'calc(var(--base) * 6)' }}>
            <div className="label" style={{ marginBottom: 'calc(var(--base) * 2)' }}>Recent Sessions</div>
            {history.slice(-5).reverse().map((h, i) => (
              <div
                key={i}
                style={{
                  borderTop: '1px solid var(--gray2)',
                  padding: 'calc(var(--base) * 2) 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    {new Date(h.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--gray)' }}>
                    {h.total} sets completed
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>✓</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── COMPLETION ─── */
function Completion({ onDone }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'calc(var(--base) * 3)' }}>
      <div style={{ maxWidth: 400, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 'calc(var(--base) * 3)' }}>✓</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 'calc(var(--base) * 2)' }}>
          Session Complete
        </h1>
        <p style={{ fontSize: 14, color: 'var(--gray)', marginBottom: 'calc(var(--base) * 4)' }}>
          Data logged. Come back tomorrow.
        </p>
        <button className="btn-primary" onClick={onDone} style={{ width: '100%' }}>
          Done
        </button>
      </div>
    </div>
  );
}

/* ─── ROOT ─── */
export default function GymBro() {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('gymbro_user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const s = localStorage.getItem('gymbro_history');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [screen, setScreen] = useState('home'); // home | workout | complete

  const handleOnboard = (userData) => {
    localStorage.setItem('gymbro_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleComplete = (session) => {
    const newHistory = [...history, session];
    localStorage.setItem('gymbro_history', JSON.stringify(newHistory));
    setHistory(newHistory);
    setScreen('complete');
  };

  if (!user) {
    return (
      <>
        <style>{CSS}</style>
        <Onboarding onComplete={handleOnboard} />
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      {screen === 'home' && <Home user={user} onStartWorkout={() => setScreen('workout')} history={history} />}
      {screen === 'workout' && <WorkoutSession user={user} onComplete={handleComplete} />}
      {screen === 'complete' && <Completion onDone={() => setScreen('home')} />}
    </>
  );
}