import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL STYLES ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-dark:     #0a0e27;
    --bg-card:     #1a1f3a;
    --accent-1:    #ff6b35;
    --accent-2:    #f7931e;
    --accent-3:    #fdb833;
    --success:     #00d084;
    --success-dark: #00a066;
    --text-main:   #ffffff;
    --text-sec:    #b0b3cc;
    --text-ter:    #6b7096;
    --border-col:  rgba(255,255,255,0.08);
    --glow-orange: rgba(255,107,53,0.25);
    --glow-green:  rgba(0,208,132,0.25);
    --radius:      20px;
    --radius-lg:   28px;
    --radius-pill: 50px;
    --shadow-sm:   0 4px 12px rgba(0,0,0,0.3);
    --shadow-md:   0 8px 24px rgba(0,0,0,0.35);
    --shadow-lg:   0 16px 40px rgba(0,0,0,0.4);
    --font:        'Inter', sans-serif;
    --font-bold:   'Space Grotesk', sans-serif;
    --pad:         24px;
    --transition:  all 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
  }

  html {
    scroll-behavior: smooth;
    overflow-y: scroll;
  }
  body {
    background: linear-gradient(135deg, var(--bg-dark) 0%, #0f1435 100%);
    color: var(--text-main);
    font-family: var(--font);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--accent-1); border-radius: 3px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes popIn { 0% { transform: scale(0.9); opacity: 0; } 70% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 var(--glow-orange); } 50% { box-shadow: 0 0 0 12px transparent; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
  @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }

  .fadeUp { animation: fadeUp .4s ease both; }
  .slideIn { animation: slideIn .4s cubic-bezier(0.34, 1.2, 0.64, 1) both; }
  .slideInDown { animation: slideInDown .4s cubic-bezier(0.34, 1.2, 0.64, 1) both; }
  .popIn { animation: popIn .5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

  .card {
    background: rgba(26, 31, 58, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border-col);
    border-radius: var(--radius);
    transition: var(--transition);
  }
  .card:hover {
    border-color: rgba(255, 107, 53, 0.4);
    background: rgba(26, 31, 58, 0.7);
    transform: translateY(-4px);
    box-shadow: var(--shadow-md), 0 0 20px var(--glow-orange);
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--accent-1), var(--accent-2), var(--accent-3));
    background-size: 300% 300%;
    border: none;
    border-radius: var(--radius-pill);
    color: white;
    font-family: var(--font-bold);
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.3px;
    padding: 16px 0;
    width: 100%;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow-md), 0 0 20px var(--glow-orange);
    position: relative;
    overflow: hidden;
  }
  .btn-primary:hover {
    background-position: 100% 50%;
    box-shadow: var(--shadow-lg), 0 0 30px var(--glow-orange);
    transform: translateY(-2px);
  }
  .btn-primary:active { transform: scale(0.97) !important; }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  .btn-secondary {
    background: transparent;
    border: 1.5px solid var(--border-col);
    border-radius: var(--radius-pill);
    color: var(--text-sec);
    font-family: var(--font);
    font-weight: 600;
    font-size: 14px;
    padding: 12px 0;
    width: 100%;
    cursor: pointer;
    transition: var(--transition);
  }
  .btn-secondary:hover {
    border-color: var(--accent-1);
    color: var(--text-main);
    background: rgba(255, 107, 53, 0.08);
    transform: translateY(-2px);
  }
  .btn-secondary:active { transform: scale(0.97); }

  .option-btn {
    background: rgba(26, 31, 58, 0.4);
    border: 1px solid var(--border-col);
    border-radius: var(--radius);
    color: var(--text-sec);
    font-family: var(--font);
    font-weight: 600;
    font-size: 14px;
    padding: 15px 18px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
  }
  .option-btn:hover {
    border-color: var(--accent-1);
    color: var(--text-main);
    background: rgba(255, 107, 53, 0.08);
    transform: translateX(4px);
  }
  .option-btn.active {
    border-color: var(--accent-1);
    background: rgba(255, 107, 53, 0.15);
    color: var(--accent-1);
    box-shadow: 0 0 20px var(--glow-orange);
  }
  .option-btn:active { transform: scale(0.96); }

  .text-input {
    width: 100%;
    background: rgba(26, 31, 58, 0.6);
    border: 1.5px solid var(--border-col);
    border-radius: var(--radius-lg);
    color: var(--text-main);
    font-family: var(--font);
    font-size: 16px;
    font-weight: 500;
    padding: 16px 18px;
    outline: none;
    transition: var(--transition);
  }
  .text-input::placeholder { color: var(--text-ter); }
  .text-input:focus {
    border-color: var(--accent-1);
    background: rgba(26, 31, 58, 0.8);
    box-shadow: 0 0 0 4px var(--glow-orange);
  }

  .choice-btn {
    flex: 1;
    background: rgba(26, 31, 58, 0.4);
    border: 1.5px solid var(--border-col);
    border-radius: var(--radius-lg);
    color: var(--text-sec);
    font-family: var(--font);
    font-weight: 600;
    font-size: 13px;
    padding: 20px 12px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    transition: var(--transition);
  }
  .choice-btn:hover {
    border-color: var(--accent-1);
    background: rgba(255, 107, 53, 0.08);
    color: var(--text-main);
  }
  .choice-btn.active {
    border-color: var(--accent-1);
    background: rgba(255, 107, 53, 0.15);
    color: var(--accent-1);
    box-shadow: 0 0 20px var(--glow-orange);
  }
  .choice-btn:active { transform: scale(0.96); }

  .tab-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-ter);
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 8px;
  }
  .tab-btn.active {
    color: var(--accent-1);
  }
  .tab-btn:active { transform: scale(0.92); }

  .set-dot {
    transition: background .3s, transform .3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow .3s;
  }
  .set-dot.done {
    background: var(--success) !important;
    box-shadow: 0 0 12px var(--glow-green);
    transform: scale(1.2);
  }
  .set-dot.current {
    background: rgba(0, 208, 132, 0.45) !important;
    animation: pulse 1.6s infinite;
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
    border-radius: 3px;
    transition: width 0.6s cubic-bezier(0.34, 1.2, 0.64, 1);
    box-shadow: 0 0 10px var(--glow-orange);
  }

  .ripple-container { position: relative; overflow: hidden; }
  .ripple-el {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 107, 53, 0.3);
    animation: ripple 0.6s ease-out forwards;
    pointer-events: none;
  }
  @keyframes ripple {
    0% { transform: scale(0); opacity: 0.6; }
    100% { transform: scale(4); opacity: 0; }
  }
`;

/* ─── DATA ─── */
const GOALS     = ["Build Muscle","Lose Fat","Increase Strength","Improve Endurance","General Fitness"];
const LEVELS    = ["Beginner","Intermediate","Advanced"];
const DURATIONS = ["30 min","45 min","60 min","75 min","90 min"];
const FOCUS     = ["Full Body","Upper Body","Lower Body","Push Day","Pull Day","Legs","Core","Cardio"];

const GYM_WORKOUT = {
  warmup:[
    {name:"Jump Rope",        sets:1,reps:"3 min",    rest:30, notes:"Light pace, wrists relaxed",         icon:"🪢"},
    {name:"Arm Circles",      sets:2,reps:"20 each",  rest:15, notes:"Full range, shoulders loose",        icon:"🔄"},
    {name:"Hip Circles",      sets:2,reps:"20 each",  rest:15, notes:"Core braced, smooth motion",         icon:"🌀"},
  ],
  main:[
    {name:"Barbell Squat",    sets:4,reps:"8–10", rest:90,muscle:"Quads · Glutes",  notes:"Drive knees out, chest tall",       icon:"🏋️"},
    {name:"Bench Press",      sets:4,reps:"8–10", rest:90,muscle:"Chest · Triceps", notes:"Grip just outside shoulder width",  icon:"💪"},
    {name:"Bent-Over Row",    sets:4,reps:"8–10", rest:90,muscle:"Back · Biceps",   notes:"Flat back, pull to belly button",   icon:"🔙"},
    {name:"Overhead Press",   sets:3,reps:"10–12",rest:75,muscle:"Shoulders",       notes:"Brace core, stack the bar over head",icon:"☝️"},
    {name:"Romanian Deadlift",sets:3,reps:"10–12",rest:75,muscle:"Hamstrings",      notes:"Hinge at hips, soft knee bend",     icon:"⬇️"},
    {name:"Cable Row",        sets:3,reps:"12–15",rest:60,muscle:"Back · Biceps",   notes:"Full stretch on every rep",         icon:"🔛"},
  ],
  cooldown:[
    {name:"Quad Stretch",sets:1,reps:"45s each",rest:0,notes:"Hold wall, sink into it", icon:"🦵"},
    {name:"Hip Flexor",  sets:1,reps:"45s each",rest:0,notes:"Lunge, hips forward",     icon:"🧘"},
    {name:"Child's Pose",sets:1,reps:"60 sec",  rest:0,notes:"Breathe deep, release",   icon:"🛐"},
  ],
};

const HOME_WORKOUT = {
  warmup:[
    {name:"High Knees",      sets:2,reps:"30 sec",   rest:15,notes:"Drive knees to hip height",         icon:"🏃"},
    {name:"Arm Swings",      sets:2,reps:"20 each",  rest:10,notes:"Cross body, full range",             icon:"🔄"},
    {name:"Hip Circles",     sets:2,reps:"20 each",  rest:10,notes:"Core braced, smooth motion",         icon:"🌀"},
  ],
  main:[
    {name:"Push-Ups",        sets:4,reps:"12–15",rest:60,muscle:"Chest · Triceps",notes:"Body straight, full range",         icon:"⬆️"},
    {name:"Bodyweight Squat",sets:4,reps:"15–20",rest:60,muscle:"Quads · Glutes", notes:"Knees out, sit back",               icon:"🏋️"},
    {name:"Plank Row",       sets:3,reps:"10 each", rest:60,muscle:"Back · Core", notes:"Use a water bottle for resistance",  icon:"🧱"},
    {name:"Lunges",          sets:3,reps:"12 each", rest:60,muscle:"Legs · Glutes",notes:"Step long, front knee over ankle", icon:"🚶"},
    {name:"Pike Push-Ups",   sets:3,reps:"10–12",rest:60,muscle:"Shoulders",     notes:"Hips high, head toward floor",      icon:"🔺"},
    {name:"Glute Bridge",    sets:3,reps:"15–20",rest:45,muscle:"Glutes · Hamstrings",notes:"Squeeze at the top, hold 1s",  icon:"🌉"},
  ],
  cooldown:[
    {name:"Doorframe Stretch",sets:1,reps:"45s each",rest:0,notes:"Chest open, lean forward gently",    icon:"🚪"},
    {name:"Standing Hamstring",sets:1,reps:"45s each",rest:0,notes:"Hinge forward, keep back flat",     icon:"🦵"},
    {name:"Child's Pose",     sets:1,reps:"60 sec",  rest:0,notes:"Breathe deep, release lower back",   icon:"🛐"},
  ],
};

function buildWorkout(user, goal, level, duration, focus) {
  const base = user.environment === "home" ? HOME_WORKOUT : GYM_WORKOUT;
  const mult = level === "Beginner" ? 0.75 : level === "Advanced" ? 1.25 : 1;
  const mod  = arr => arr.map(e => ({ ...e, sets: Math.round(e.sets * mult) }));
  return {
    goal, level, duration, focus,
    environment: user.environment,
    warmup:   mod(base.warmup),
    main:     mod(base.main),
    cooldown: mod(base.cooldown),
    estimatedCalories: parseInt(duration) * 7,
  };
}

/* ─── RIPPLE ─── */
function useRipple() {
  return (e, ref) => {
    if (!ref?.current) return;
    const btn  = ref.current;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const el   = document.createElement("span");
    el.className = "ripple-el";
    el.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
    btn.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  };
}

/* ─── SHARED COMPONENTS ─── */
function Card({ children, style, className="", onClick, delay=0 }) {
  const ref = useRef(); const ripple = useRipple();
  return (
    <div ref={ref} className={`card ripple-container ${className}`}
      style={{ animationDelay:`${delay}ms`, ...style }}
      onClick={e => { if(onClick){ ripple(e,ref); onClick(e); } }}>
      {children}
    </div>
  );
}

function Button({ children, onClick, style, disabled, variant="primary" }) {
  const ref = useRef(); const ripple = useRipple();
  const className = variant === "primary" ? "btn-primary" : "btn-secondary";
  return (
    <button ref={ref} className={`${className} ripple-container`} style={style} disabled={disabled}
      onClick={e => { ripple(e,ref); onClick&&onClick(e); }}>
      {children}
    </button>
  );
}

function StatCard({ label, value, unit="", delay=0 }) {
  return (
    <Card delay={delay} style={{ flex:1, padding:"16px 12px", textAlign:"center" }}>
      <div style={{ fontFamily:"var(--font-bold)", fontSize:26, fontWeight:700, color:"var(--accent-1)", lineHeight:1 }}>
        {value}<span style={{ fontSize:12, marginLeft:3, color:"var(--text-sec)" }}>{unit}</span>
      </div>
      <div style={{ fontSize:10, color:"var(--text-ter)", fontWeight:600, letterSpacing:0.5, marginTop:6, textTransform:"uppercase" }}>
        {label}
      </div>
    </Card>
  );
}

/* ─── ONBOARDING ─── */
function OnboardingScreen({ onComplete }) {
  const [step,  setStep]  = useState(0);
  const [name,  setName]  = useState("");
  const [sex,   setSex]   = useState(null);
  const [env,   setEnv]   = useState(null);
  const [key,   setKey]   = useState(0);
  const inputRef = useRef();

  const next = () => { setStep(s => s+1); setKey(k => k+1); };

  const handleDone = () => {
    if (!name.trim() || !sex || !env) return;
    const user = { name: name.trim(), sex, environment: env };
    localStorage.setItem("gymbro_user", JSON.stringify(user));
    onComplete(user);
  };

  const steps = [
    // Step 0 — Name
    <div key="name" className="slideIn" style={{ animationDelay:"0ms" }}>
      <div style={{ fontSize:12, color:"var(--text-ter)", fontWeight:700, letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>Step 1 of 3</div>
      <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:32, marginBottom:8, lineHeight:1.2, color:"var(--text-main)" }}>What's your name?</div>
      <div style={{ fontSize:15, color:"var(--text-sec)", marginBottom:32 }}>Let's get personal with your fitness journey.</div>
      <input
        ref={inputRef}
        className="text-input"
        placeholder="Enter your name…"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && name.trim() && next()}
        autoFocus
        style={{ marginBottom:20 }}
      />
      <Button onClick={next} disabled={!name.trim()}>Continue →</Button>
    </div>,

    // Step 1 — Sex
    <div key="sex" className="slideIn" style={{ animationDelay:"0ms" }}>
      <div style={{ fontSize:12, color:"var(--text-ter)", fontWeight:700, letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>Step 2 of 3</div>
      <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:32, marginBottom:8, lineHeight:1.2, color:"var(--text-main)" }}>Biological sex</div>
      <div style={{ fontSize:15, color:"var(--text-sec)", marginBottom:32 }}>Helps tailor volume and intensity defaults.</div>
      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        {[{v:"male",icon:"♂️",label:"Male"},{v:"female",icon:"♀️",label:"Female"},{v:"other",icon:"⚧",label:"Other"}].map(o => (
          <button key={o.v} className={`choice-btn ${sex===o.v?"active":""}`} onClick={() => setSex(o.v)}>
            <span style={{ fontSize:32 }}>{o.icon}</span>
            <span style={{fontSize:13}}>{o.label}</span>
          </button>
        ))}
      </div>
      <Button onClick={next} disabled={!sex}>Continue →</Button>
      <button className="btn-secondary" style={{ marginTop:12 }} onClick={() => { setStep(0); setKey(k=>k+1); }}>← Back</button>
    </div>,

    // Step 2 — Environment
    <div key="env" className="slideIn" style={{ animationDelay:"0ms" }}>
      <div style={{ fontSize:12, color:"var(--text-ter)", fontWeight:700, letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>Step 3 of 3</div>
      <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:32, marginBottom:8, lineHeight:1.2, color:"var(--text-main)" }}>Where do you train?</div>
      <div style={{ fontSize:15, color:"var(--text-sec)", marginBottom:32 }}>We'll build programs with the right equipment.</div>
      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        {[
          {v:"gym",  icon:"🏋️", label:"Gym",  sub:"Full equipment access"},
          {v:"home", icon:"🏠", label:"Home", sub:"Bodyweight & minimal gear"},
        ].map(o => (
          <button key={o.v} className={`choice-btn ${env===o.v?"active":""}`} onClick={() => setEnv(o.v)} style={{flex:1, padding:"24px 12px"}}>
            <span style={{ fontSize:40 }}>{o.icon}</span>
            <span style={{ fontWeight:700, fontSize:15 }}>{o.label}</span>
            <span style={{ fontSize:12, color:"var(--text-ter)", fontWeight:500 }}>{o.sub}</span>
          </button>
        ))}
      </div>
      <Button onClick={handleDone} disabled={!env}>Start Your Journey 🔥</Button>
      <button className="btn-secondary" style={{ marginTop:12 }} onClick={() => { setStep(1); setKey(k=>k+1); }}>← Back</button>
    </div>,
  ];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"var(--pad) var(--pad) 0", position:"relative" }}>
      {/* animated background gradients */}
      <div style={{ position:"fixed", top:-150, left:-150, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)", pointerEvents:"none", zIndex:0, animation:"float 8s ease-in-out infinite" }} />
      <div style={{ position:"fixed", bottom:-100, right:-100, width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,208,132,0.12) 0%, transparent 70%)", pointerEvents:"none", zIndex:0, animation:"float 10s ease-in-out infinite 1s" }} />

      <div style={{ width:"100%", maxWidth:450, position:"relative", zIndex:1 }}>
        {/* Logo */}
        <div className="fadeUp" style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{
            width:80, height:80, borderRadius:24, margin:"0 auto 20px",
            background:"linear-gradient(135deg, var(--accent-1), var(--accent-2))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:40, boxShadow:"0 12px 32px rgba(255,107,53,0.4)",
            animation:"popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>💪</div>
          <div style={{
            fontFamily:"var(--font-bold)", fontWeight:900, fontSize:40,
            background:"linear-gradient(135deg, var(--accent-1), var(--accent-2))",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            letterSpacing:"-1px", marginBottom:8,
          }}>GymBro</div>
          <div style={{ fontSize:15, color:"var(--text-sec)" }}>Your AI fitness coach awaits</div>
        </div>

        {/* Step progress dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:40 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: i===step ? 28 : 10, height:10, borderRadius:5,
              background: i<=step ? "var(--accent-1)" : "var(--border-col)",
              transition:"all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)",
              boxShadow: i===step ? "0 0 12px var(--glow-orange)" : "none",
            }} />
          ))}
        </div>

        {/* Step content */}
        <div key={key}>
          {steps[step]}
        </div>
      </div>
    </div>
  );
}

/* ─── HEADER ─── */
function Header({ user, onEditProfile }) {
  return (
    <div style={{
      padding:"20px var(--pad) 0",
      background:"linear-gradient(180deg, rgba(10,14,39,0.8) 0%, transparent 100%)",
      position:"sticky", top:0, zIndex:20,
      backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
    }}>
      <div className="slideInDown" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:40, height:40, borderRadius:14,
            background:"linear-gradient(135deg, var(--accent-1), var(--accent-2))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20, boxShadow:"0 6px 16px var(--glow-orange)",
          }}>💪</div>
          <div style={{
            fontFamily:"var(--font-bold)", fontWeight:900, fontSize:26,
            background:"linear-gradient(135deg, var(--accent-1), var(--accent-2))",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            letterSpacing:"-0.5px",
          }}>GymBro</div>
        </div>
        {user && (
          <button onClick={onEditProfile} style={{
            display:"flex", alignItems:"center", gap:9,
            background:"rgba(26, 31, 58, 0.5)", border:"1px solid var(--border-col)",
            borderRadius:"var(--radius-pill)", padding:"8px 14px 8px 10px",
            cursor:"pointer", transition:"var(--transition)",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--accent-1)"; e.currentTarget.style.background="rgba(255,107,53,0.08)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border-col)"; e.currentTarget.style.background="rgba(26, 31, 58, 0.5)"; }}
          >
            <div style={{
              width:28, height:28, borderRadius:"50%",
              background:"linear-gradient(135deg, var(--accent-1), var(--accent-2))",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:800, color:"white",
            }}>{user.name.charAt(0).toUpperCase()}</div>
            <span style={{ fontSize:13, fontWeight:600, color:"var(--text-sec)" }}>{user.name.split(" ")[0]}</span>
          </button>
        )}
      </div>
      <div style={{ height:1, background:"linear-gradient(90deg, var(--accent-1), transparent)", marginTop:12, opacity:0.3 }} />
    </div>
  );
}

/* ─── TAB BAR ─── */
function TabBar({ active, onChange }) {
  const tabs=[
    {id:"home",  icon:"⚡", label:"Home"},
    {id:"create",icon:"⚙️",  label:"Build"},
    {id:"workout",icon:"🔥",label:"Train"},
    {id:"history",icon:"📊",label:"Stats"},
  ];
  return (
    <div style={{
      position:"sticky", bottom:0, width:"100%",
      background:"linear-gradient(180deg, transparent, rgba(10,14,39,0.95))", 
      backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
      borderTop:"1px solid var(--border-col)",
      display:"flex", zIndex:100, padding:"12px var(--pad) 20px", gap:6,
    }}>
      {tabs.map(t => {
        const on = active===t.id;
        return (
          <button key={t.id} className="tab-btn" onClick={()=>onChange(t.id)} style={{
            flex:1, background:"none", border:"none", cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"10px 4px",
            color: on ? "var(--accent-1)" : "var(--text-ter)",
            transition:"var(--transition)",
          }}>
            <div style={{
              width:44, height:44, borderRadius:14,
              background: on ? "rgba(255,107,53,0.15)" : "transparent",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
              transition:"var(--transition)",
              transform: on ? "scale(1.1)" : "scale(1)",
              boxShadow: on ? "0 0 16px var(--glow-orange)" : "none",
              border: on ? "1px solid rgba(255,107,53,0.3)" : "none",
            }}>{t.icon}</div>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:0.3, fontFamily:"var(--font-bold)", opacity: on?1:.5, transition:"opacity 0.2s" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── HOME ─── */
const TIPS=[
  "Progressive overload is key. Add just a bit more weight each week.",
  "Sleep 7–9 hours nightly — that's when muscles repair and grow.",
  "Aim for 0.8–1g protein per lb of bodyweight daily.",
  "Rest 60–90s for hypertrophy, 3–5 min for strength.",
  "Deload every 4–6 weeks. Recovery is training too.",
];

function HomeScreen({ user, onStart, savedWorkout, stats }) {
  const tip = TIPS[Math.floor(Date.now()/86400000)%TIPS.length];
  const h = new Date().getHours();
  const greeting = h<12?"Good morning":h<17?"Good afternoon":"Good evening";
  const envIcon  = user.environment==="home" ? "🏠" : "🏋️";

  return (
    <div style={{ padding:"24px var(--pad) 0" }}>
      <div className="fadeUp" style={{ marginBottom:28 }}>
        <div style={{ fontSize:12, color:"var(--text-ter)", fontWeight:600, letterSpacing:0.5, marginBottom:6 }}>
          {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
        </div>
        <div style={{ fontFamily:"var(--font-bold)", fontSize:28, fontWeight:900, lineHeight:1.35, marginBottom:8 }}>
          {greeting}<span style={{ color:"var(--accent-1)" }>,</span><br/>
          <span style={{ background:"linear-gradient(135deg,var(--accent-1),var(--accent-2))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{user.name.split(" ")[0]}</span>
        </div>
        <div style={{ fontSize:13, color:"var(--text-sec)", display:"flex", gap:8, alignItems:"center" }}>
          <span>{envIcon}</span>
          <span>{user.environment==="home"?"Home workouts":"Gym workouts"}</span>
          <span>·</span>
          <span>{user.sex.charAt(0).toUpperCase()+user.sex.slice(1)}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginBottom:24 }}>
        <StatCard label="Total" value={stats.total} delay={0} />
        <StatCard label="This Week" value={stats.week} delay={100} />
        <StatCard label="Streak" unit="🔥" value={stats.streak} delay={200} />
      </div>

      {/* Saved Workout or CTA */}
      {savedWorkout ? (
        <Card delay={250} style={{
          padding:24, marginBottom:20,
          border:"1.5px solid var(--accent-1)",
          background:"linear-gradient(135deg, rgba(255,107,53,0.12), rgba(10,14,39,0.5))",
          boxShadow:"0 12px 32px var(--glow-orange)",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <div style={{ fontSize:11, color:"var(--accent-1)", fontWeight:700, letterSpacing:1, marginBottom:6, textTransform:"uppercase", fontFamily:"var(--font-bold)" }}>Ready to Train</div>
              <div style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:20, marginBottom:2 }}>{savedWorkout.focus}</div>
              <div style={{ fontSize:12, color:"var(--text-ter)" }}>{savedWorkout.goal} · {savedWorkout.level}</div>
            </div>
            <div style={{ width:48, height:48, borderRadius:14, background:"rgba(255,107,53,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, border:"1px solid var(--accent-1)" }}>
              {savedWorkout.environment==="home"?"🏠":"🏋️"}
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
            {[savedWorkout.duration, savedWorkout.environment==="home"?"Home":"Gym"].map(tag => (
              <span key={tag} style={{ background:"rgba(255,107,53,0.1)", border:"1px solid var(--accent-1)", padding:"4px 12px", borderRadius:20, fontSize:12, color:"var(--accent-1)", fontWeight:600 }}>{tag}</span>
            ))}
          </div>
          <Button onClick={onStart}>Start Session Now →</Button>
        </Card>
      ) : (
        <Card delay={250} style={{ padding:32, marginBottom:20, textAlign:"center", border:"1.5px dashed var(--border-col)" }}>
          <div style={{ fontSize:48, marginBottom:12, animation:"float 3s ease-in-out infinite" }}>🏗️</div>
          <div style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:17, marginBottom:6, color:"var(--text-main)" }}>No Workout Yet</div>
          <div style={{ fontSize:14, color:"var(--text-ter)" }}>Head to Build to create your personalized plan</div>
        </Card>
      )}

      {/* Coach Tip */}
      <Card delay={350} style={{ padding:18 }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
          <div style={{ width:40, height:40, borderRadius:12, flexShrink:0, background:"rgba(255,107,53,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, border:"1px solid var(--accent-1)" }}>💡</div>
          <div>
            <div style={{ fontSize:11, color:"var(--accent-1)", fontWeight:700, letterSpacing:0.5, marginBottom:5, textTransform:"uppercase", fontFamily:"var(--font-bold)" }}>Pro Tip</div>
            <div style={{ fontSize:14, color:"var(--text-sec)", lineHeight:1.6, fontStyle:"italic" }}>"{tip}"</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─── BUILD ─── */
function BuildScreen({ user, onWorkoutCreated }) {
  const [step,     setStep]     = useState(0);
  const [goal,     setGoal]     = useState(null);
  const [level,    setLevel]    = useState(null);
  const [duration, setDuration] = useState(null);
  const [focus,    setFocus]    = useState(null);
  const [gen,      setGen]      = useState(false);
  const [aiMsg,    setAiMsg]    = useState("");
  const [workout,  setWorkout]  = useState(null);
  const [key,      setKey]      = useState(0);

  const next = () => setTimeout(()=>{ setStep(s=>Math.min(s+1,3)); setKey(k=>k+1); }, 200);

  const steps=[
    {title:"What's your goal?",      sub:"Choose what drives you",                   options:GOALS,     val:goal,     set:v=>{setGoal(v);    next();}},
    {title:"Your experience",        sub:"Where are you in your fitness journey?",   options:LEVELS,    val:level,    set:v=>{setLevel(v);   next();}},
    {title:"How much time?",         sub:"Build your plan around your schedule",     options:DURATIONS, val:duration, set:v=>{setDuration(v);next();}},
    {title:"What's the focus?",      sub:"Pick your main target today",              options:FOCUS,     val:focus,    set:v=>setFocus(v)},
  ];

  const generate = async () => {
    setGen(true); setAiMsg("");
    const envNote = user.environment==="home"
      ? "They train at HOME — use bodyweight and minimal equipment only."
      : "They train at the GYM — barbells, machines, cables available.";
    const sexNote = user.sex==="female" ? "slightly higher rep ranges and more hip-dominant exercises" : user.sex==="male" ? "compound-heavy programming" : "balanced programming";
    const prompt = `You are GymBro, an elite AI fitness coach. User: Name=${user.name}, Sex=${user.sex}. Build: Goal=${goal}, Level=${level}, Duration=${duration}, Focus=${focus}. ${envNote} Use ${sexNote}. Write a SHORT, PUNCHY 2-sentence motivational intro calling them by first name. Max 55 words. Be ENERGETIC!`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]}),
      });
      const d = await r.json();
      setAiMsg(d.content?.map(b=>b.text||"").join("")||"");
    } catch { setAiMsg(`Let's go, ${user.name}! Your ${focus} workout is locked in.`); }
    setTimeout(()=>{ setWorkout(buildWorkout(user,goal,level,duration,focus)); setGen(false); },1200);
  };

  if (gen) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:450, padding:"40px var(--pad)" }}>
      <div style={{
        width:72, height:72, borderRadius:22,
        background:"linear-gradient(135deg, var(--accent-1), var(--accent-2))",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:32, marginBottom:24, animation:"spin 1.2s linear infinite",
        boxShadow:"0 0 32px var(--glow-orange)",
      }}>⚡</div>
      <div style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:22, marginBottom:8, textAlign:"center" }}>Building Your Workout</div>
      <div style={{ color:"var(--text-ter)", fontSize:14, textAlign:"center" }}>Personalizing for {user.name}…</div>
    </div>
  );

  if (workout) return (
    <div style={{ padding:"24px var(--pad) 0" }}>
      {aiMsg && (
        <Card delay={0} style={{ padding:18, marginBottom:20, border:"1.5px solid var(--accent-1)", background:"rgba(255,107,53,0.08)" }}>
          <div style={{ fontSize:11, color:"var(--accent-1)", fontWeight:700, letterSpacing:0.5, marginBottom:6, textTransform:"uppercase", fontFamily:"var(--font-bold)" }}>🤖 AI Coach Intro</div>
          <div style={{ fontSize:14, color:"var(--text-sec)", lineHeight:1.7, fontStyle:"italic" }}>{aiMsg}</div>
        </Card>
      )}
      <div className="fadeUp" style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:24, marginBottom:10 }}>{workout.focus} Workout</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[workout.goal,workout.level,workout.duration,workout.environment==="home"?"🏠 Home":"🏋️ Gym"].map(t=>(
            <span key={t} style={{ background:"rgba(255,107,53,0.1)", border:"1px solid var(--accent-1)", padding:"5px 12px", borderRadius:20, fontSize:12, color:"var(--accent-1)", fontWeight:600 }}>{t}</span>
          ))}
        </div>
      </div>

      {["warmup","main","cooldown"].map((ph,pi)=>(
        <div key={ph} style={{ marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:11, letterSpacing:0.5, color:ph==="main"?"var(--accent-1)":"var(--text-ter)", textTransform:"uppercase" }}>
              {ph==="warmup"?"🔥 Warmup":ph==="main"?"⚡ Main":"❄️ Cooldown"}
            </div>
            <div style={{ flex:1, height:1, background:ph==="main"?"var(--accent-1)":"var(--border-col)", opacity:ph==="main"?0.6:0.3 }} />
          </div>
          {workout[ph].map((ex,i)=>(
            <Card key={i} delay={i*40+pi*50} style={{ padding:"16px 16px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start", flex:1 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"rgba(255,107,53,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, border:"1px solid var(--accent-1)" }}>{ex.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>{ex.name}</div>
                  {ex.muscle&&<div style={{ fontSize:11, color:"var(--accent-1)", fontWeight:600, letterSpacing:0.3, marginBottom:3 }}>{ex.muscle}</div>}
                  <div style={{ fontSize:12, color:"var(--text-ter)", lineHeight:1.4 }}>{ex.notes}</div>
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0, marginLeft:12 }}>
                <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:16, color:"var(--accent-1)" }}>{ex.sets}×{ex.reps}</div>
                {ex.rest>0&&<div style={{ fontSize:11, color:"var(--text-ter)", marginTop:3 }}>Rest {ex.rest}s</div>}
              </div>
            </Card>
          ))}
        </div>
      ))}

      <div style={{ display:"flex", flexDirection:"column", gap:10, paddingBottom:8 }}>
        <Button onClick={()=>onWorkoutCreated(workout)}>Save This Workout ✓</Button>
        <Button onClick={()=>setWorkout(null)} variant="secondary">← Rebuild</Button>
      </div>
    </div>
  );

  const cur = steps[step];
  return (
    <div style={{ padding:"24px var(--pad) 0" }}>
      {/* Progress bar */}
      <div style={{ display:"flex", gap:6, marginBottom:28 }}>
        {steps.map((_,i)=>(
          <div key={i} style={{
            flex:1, height:5, borderRadius:3,
            background:i<step?"var(--accent-1)":i===step?"var(--accent-2)":"var(--border-col)",
            transition:"background 0.4s ease",
            boxShadow:i<=step?"0 0 10px var(--glow-orange)":"none",
          }}/>
        ))}
      </div>

      <div key={key} className="slideIn">
        <div style={{ fontSize:12, color:"var(--text-ter)", fontWeight:700, letterSpacing:0.5, marginBottom:6, textTransform:"uppercase", fontFamily:"var(--font-bold)" }}>Step {step+1} of {steps.length}</div>
        <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:26, marginBottom:6, lineHeight:1.2 }}>{cur.title}</div>
        <div style={{ fontSize:14, color:"var(--text-sec)", marginBottom:28 }}>{cur.sub}</div>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {cur.options.map((opt,i)=>(
            <button key={opt} className={`option-btn fadeUp ${cur.val===opt?"active":""}`} onClick={()=>cur.set(opt)} style={{animationDelay:`${i*50}ms`}}>
              <span>{opt}</span>
              {cur.val===opt&&<span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop:28, display:"flex", flexDirection:"column", gap:10 }}>
        {step===3&&focus&&<Button onClick={generate}>Generate Workout ⚡</Button>}
        {step>0&&<Button onClick={()=>{setStep(s=>s-1);setKey(k=>k+1);}} variant="secondary">← Back</Button>}
      </div>
    </div>
  );
}

/* ─── REST TIMER ─── */
function RestTimer({ seconds, onDone }) {
  const [rem,setRem]=useState(seconds);
  useEffect(()=>{
    if(rem<=0){onDone();return;}
    const t=setTimeout(()=>setRem(r=>r-1),1000);
    return()=>clearTimeout(t);
  },[rem]);
  const R=58, circ=2*Math.PI*R;
  return (
    <div className="fadeIn" style={{ position:"fixed",inset:0,background:"rgba(10,14,39,.96)",backdropFilter:"blur(16px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:300,padding:"var(--pad) 0" }}>
      <Card style={{ padding:"48px 56px", textAlign:"center", border:"1.5px solid var(--accent-1)", boxShadow:"0 0 60px var(--glow-orange)" }}>
        <div style={{ fontSize:13, color:"var(--text-ter)", fontWeight:700, letterSpacing:1.5, marginBottom:24, textTransform:"uppercase", fontFamily:"var(--font-bold)" }}>Rest Time</div>
        <div style={{ position:"relative", width:140, height:140, margin:"0 auto 28px" }}>
          <svg width={140} height={140} style={{ position:"absolute",top:0,left:0 }}>
            <circle cx={70} cy={70} r={R} fill="none" stroke="var(--border-col)" strokeWidth={7}/>
            <circle cx={70} cy={70} r={R} fill="none" stroke="var(--accent-1)" strokeWidth={7}
              strokeDasharray={circ} strokeDashoffset={circ*(1-rem/seconds)}
              strokeLinecap="round" transform="rotate(-90 70 70)"
              style={{transition:"stroke-dashoffset 1s linear",filter:"drop-shadow(0 0 12px var(--glow-orange))"}}
            />
          </svg>
          <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
            <div style={{ fontFamily:"var(--font-bold)",fontWeight:800,fontSize:44,lineHeight:1,color:"var(--accent-1)" }}>{rem}</div>
            <div style={{ fontSize:11,color:"var(--text-ter)",fontWeight:600,letterSpacing:0.5,marginTop:6 }}>seconds</div>
          </div>
        </div>
        <Button onClick={onDone} variant="secondary" style={{marginTop:8}}>Skip Rest</Button>
      </Card>
    </div>
  );
}

/* ─── WORKOUT SCREEN ─── */
function WorkoutScreen({ workout, onComplete }) {
  const PHASES=["warmup","main","cooldown"];
  const [pi,setPi]=useState(0);
  const [ei,setEi]=useState(0);
  const [si,setSi]=useState(0);
  const [resting,setResting]=useState(false);
  const [log,setLog]=useState({});
  const [done,setDone]=useState(false);
  const [aiTip,setAiTip]=useState("");
  const [tipLoad,setTipLoad]=useState(false);
  const [cKey,setCKey]=useState(0);

  if(!workout) return (
    <div style={{ padding:40, textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:18, animation:"float 3s ease-in-out infinite" }}>💪</div>
      <div style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:22, marginBottom:8 }}>No Workout Ready</div>
      <div style={{ color:"var(--text-sec)", fontSize:14 }}>Build a workout first in the Build tab</div>
    </div>
  );

  const phase=PHASES[pi];
  const exs=workout[phase];
  const ex=exs[ei];
  const totalSets=PHASES.reduce((a,p)=>a+workout[p].reduce((b,e)=>b+e.sets,0),0);
  const doneSets=Object.values(log).reduce((a,v)=>a+v,0);
  const progress=doneSets/totalSets;
  const lk=`${phase}-${ei}`;

  const fetchTip=async()=>{
    setAiTip(""); setTipLoad(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`GymBro AI: ONE form cue (max 15 words) for ${ex.name}. Bold. Specific.`}]}),
      });
      const d=await r.json();
      setAiTip(d.content?.map(b=>b.text||"").join("")||ex.notes);
    }catch{setAiTip(ex.notes);}
    setTipLoad(false);
  };

  useEffect(()=>{ fetchTip(); setCKey(k=>k+1); },[ei,pi]);

  const advance=()=>{
    if(ei+1<exs.length){setEi(i=>i+1);setSi(0);}
    else if(pi+1<PHASES.length){setPi(p=>p+1);setEi(0);setSi(0);}
    else{setDone(true);onComplete&&onComplete({workout,log,completedAt:new Date()});}
  };
  const afterRest=()=>{ setResting(false); if(si+1<ex.sets)setSi(s=>s+1); else advance(); };
  const handleSet=()=>{
    const nl={...log,[lk]:(log[lk]||0)+1}; setLog(nl);
    if(si+1<ex.sets){if(ex.rest>0)setResting(true);else setSi(s=>s+1);}
    else{if(ex.rest>0)setResting(true);else advance();}
  };

  if(done) return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:480,padding:"40px var(--pad) 0" }}>
      <div className="popIn" style={{ textAlign:"center" }}>
        <div style={{ fontSize:80, marginBottom:20, animation:"float 3s ease-in-out infinite" }}>🏆</div>
        <div style={{ fontFamily:"var(--font-bold)", fontWeight:900, fontSize:32, marginBottom:8, background:"linear-gradient(135deg,var(--accent-1),var(--accent-2))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Session Crushed!</div>
        <div style={{ color:"var(--text-sec)", fontSize:16, marginBottom:32 }}>Rest, eat, recover. You earned it. 💪</div>
        <div style={{ display:"flex", gap:14, justifyContent:"center", marginBottom:28 }}>
          <Card style={{ padding:"18px 24px", textAlign:"center" }}>
            <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:28, color:"var(--accent-1)" }}>{doneSets}</div>
            <div style={{ fontSize:11, color:"var(--text-ter)", fontWeight:700, letterSpacing:0.5, marginTop:5, textTransform:"uppercase" }}>Sets Done</div>
          </Card>
          <Card style={{ padding:"18px 24px", textAlign:"center" }}>
            <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:28, color:"var(--success)" }}>{workout.estimatedCalories}</div>
            <div style={{ fontSize:11, color:"var(--text-ter)", fontWeight:700, letterSpacing:0.5, marginTop:5, textTransform:"uppercase" }}>Cal Est.</div>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"24px var(--pad) 0" }}>
      {resting&&<RestTimer seconds={ex.rest} onDone={afterRest}/>}

      {/* Progress */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <div style={{ fontSize:12, color:"var(--text-ter)", fontWeight:700, letterSpacing:0.5, textTransform:"uppercase", fontFamily:"var(--font-bold)" }}>{phase} · {ei+1}/{exs.length}</div>
          <div style={{ fontSize:12, color:"var(--accent-1)", fontWeight:800, fontFamily:"var(--font-bold)" }}>{Math.round(progress*100)}%</div>
        </div>
        <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
          <div className="progress-fill" style={{ height:"100%", width:`${progress*100}%` }}/>
        </div>
      </div>

      {/* Exercise Card */}
      <Card key={cKey} delay={0} style={{
        padding:24, marginBottom:18,
        border:"1.5px solid var(--accent-1)",
        background:"linear-gradient(135deg,rgba(255,107,53,0.08),rgba(10,14,39,0.4))",
        boxShadow:"0 12px 40px var(--glow-orange)",
      }}>
        <div style={{ display:"flex", gap:15, alignItems:"flex-start", marginBottom:18 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"rgba(255,107,53,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0, boxShadow:"0 6px 18px var(--glow-orange)", border:"1px solid var(--accent-1)" }}>{ex.icon}</div>
          <div>
            {ex.muscle&&<div style={{ fontSize:11, color:"var(--accent-1)", fontWeight:700, letterSpacing:0.5, marginBottom:4, textTransform:"uppercase", fontFamily:"var(--font-bold)" }}>{ex.muscle}</div>}
            <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:22, lineHeight:1.1 }}>{ex.name}</div>
          </div>
        </div>

        {/* Set Info Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginBottom:18 }}>
          {[{l:"Reps",v:ex.reps},{l:"Set",v:`${si+1}/${ex.sets}`},...(ex.rest>0?[{l:"Rest",v:`${ex.rest}s`}]:[])].map((item,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"12px 8px", textAlign:"center", border:"1px solid var(--border-col)" }}>
              <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:18, color:"var(--accent-1)", lineHeight:1 }}>{item.v}</div>
              <div style={{ fontSize:10, color:"var(--text-ter)", fontWeight:700, letterSpacing:0.3, marginTop:5, textTransform:"uppercase" }}>{item.l}</div>
            </div>
          ))}
        </div>

        {/* Set Progress Dots */}
        <div style={{ display:"flex", gap:6, marginBottom:18 }}>
          {Array.from({length:ex.sets}).map((_,i)=>(
            <div key={i} className={`set-dot ${i<si?"done":i===si?"current":""}`} style={{
              flex:1, height:8, borderRadius:4,
              background:i<si?"var(--success)":i===si?"rgba(255,107,53,0.5)":"var(--border-col)",
            }}/>
          ))}
        </div>

        {/* AI Tip */}
        <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:12, padding:"12px 14px", display:"flex", gap:10, alignItems:"flex-start", border:"1px solid var(--border-col)" }}>
          <span style={{ fontSize:16, flexShrink:0 }}>🤖</span>
          <span style={{ fontSize:13, color:"var(--text-sec)", lineHeight:1.6, fontStyle:"italic" }}>
            {tipLoad?<span style={{color:"var(--text-ter)"}}>Loading…</span>:(aiTip||ex.notes)}
          </span>
        </div>
      </Card>

      {/* Complete Set Button */}
      <Button onClick={handleSet} style={{marginBottom:12}}>Complete Set ✓</Button>

      {/* Navigation */}
      {(ei>0||pi>0)&&(
        <Button onClick={()=>{
          if(ei>0){setEi(i=>i-1);setSi(0);}
          else if(pi>0){setPi(p=>p-1);setEi(workout[PHASES[pi-1]].length-1);setSi(0);}
        }} variant="secondary">← Previous Exercise</Button>
      )}
    </div>
  );
}

/* ─── HISTORY ─── */
function HistoryScreen({ history }) {
  if(!history.length) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, padding:"40px var(--pad)", textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:18, animation:"float 3s ease-in-out infinite" }}>📊</div>
      <div style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:22, marginBottom:8 }}>No Data Yet</div>
      <div style={{ color:"var(--text-sec)", fontSize:15 }}>Complete a workout to track your progress</div>
    </div>
  );
  const total=history.length;
  const week=history.filter(h=>(new Date()-new Date(h.completedAt))<7*86400000).length;
  const sets=history.reduce((a,h)=>a+Object.values(h.log||{}).reduce((b,v)=>b+v,0),0);
  return (
    <div style={{ padding:"24px var(--pad) 0" }}>
      <div className="fadeUp" style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:28, marginBottom:22 }}>Your Stats</div>
      
      {/* Stats Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginBottom:28 }}>
        <StatCard label="Total" value={total} delay={0} />
        <StatCard label="This Week" value={week} delay={100} />
        <StatCard label="Sets" value={sets} delay={200} />
      </div>

      <div style={{ fontSize:12, color:"var(--text-ter)", fontWeight:700, letterSpacing:0.5, marginBottom:14, textTransform:"uppercase", fontFamily:"var(--font-bold)" }}>Recent Sessions</div>
      {[...history].reverse().slice(0,10).map((h,i)=>(
        <Card key={i} delay={i*50} style={{ padding:"16px 16px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:12, alignItems:"center", flex:1 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,107,53,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, border:"1px solid var(--accent-1)" }}>
              {h.workout?.environment==="home"?"🏠":"🏋️"}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>{h.workout?.focus}</div>
              <div style={{ fontSize:12, color:"var(--text-ter)" }}>
                {new Date(h.completedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})} · {h.workout?.duration}
              </div>
            </div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:16, color:"var(--accent-1)" }}>{Object.values(h.log||{}).reduce((a,v)=>a+v,0)}</div>
            <div style={{ fontSize:11, color:"var(--success)", fontWeight:700, marginTop:2 }}>✓ Done</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ─── PROFILE MODAL ─── */
function ProfileModal({ user, onSave, onClose }) {
  const [name, setName]=useState(user.name);
  const [sex,  setSex] =useState(user.sex);
  const [env,  setEnv] =useState(user.environment);
  return (
    <div className="fadeIn" style={{ position:"fixed",inset:0,background:"rgba(10,14,39,.94)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:"var(--pad) 0" }}>
      <Card style={{ width:"100%", maxWidth:440, padding:32, border:"1.5px solid var(--accent-1)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <div style={{ fontFamily:"var(--font-bold)", fontWeight:800, fontSize:22, color:"var(--text-main)" }}>Edit Profile</div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"var(--text-ter)",fontSize:24,cursor:"pointer",lineHeight:1,padding:4,transition:"var(--transition)" }}
            onMouseEnter={e=>{e.currentTarget.style.color="var(--accent-1)";}}
            onMouseLeave={e=>{e.currentTarget.style.color="var(--text-ter)";}}
          >✕</button>
        </div>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, color:"var(--text-ter)", fontWeight:700, letterSpacing:0.5, marginBottom:10, textTransform:"uppercase", fontFamily:"var(--font-bold)" }}>Name</div>
          <input className="text-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/>
        </div>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, color:"var(--text-ter)", fontWeight:700, letterSpacing:0.5, marginBottom:10, textTransform:"uppercase", fontFamily:"var(--font-bold)" }}>Biological Sex</div>
          <div style={{ display:"flex", gap:10 }}>
            {[{v:"male",icon:"♂️",label:"Male"},{v:"female",icon:"♀️",label:"Female"},{v:"other",icon:"⚧",label:"Other"}].map(o=>(
              <button key={o.v} className={`choice-btn ${sex===o.v?"active":""}`} onClick={()=>setSex(o.v)} style={{ padding:"16px 10px", flex:1 }}>
                <span style={{fontSize:24}}>{o.icon}</span>
                <span style={{fontSize:12}}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:12, color:"var(--text-ter)", fontWeight:700, letterSpacing:0.5, marginBottom:10, textTransform:"uppercase", fontFamily:"var(--font-bold)" }}>Training Environment</div>
          <div style={{ display:"flex", gap:10 }}>
            {[{v:"gym",icon:"🏋️",label:"Gym"},{v:"home",icon:"🏠",label:"Home"}].map(o=>(
              <button key={o.v} className={`choice-btn ${env===o.v?"active":""}`} onClick={()=>setEnv(o.v)} style={{ padding:"18px 12px", flex:1 }}>
                <span style={{fontSize:32}}>{o.icon}</span>
                <span style={{fontWeight:700,fontSize:15}}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
        <Button onClick={()=>{ if(name.trim()&&sex&&env) onSave({name:name.trim(),sex,environment:env}); }} disabled={!name.trim()||!sex||!env}>Save Changes ✓</Button>
        <Button onClick={onClose} variant="secondary" style={{marginTop:12}}>Cancel</Button>
      </Card>
    </div>
  );
}



/* ─── ROOT ─── */
export default function GymBro() {
  const [user,    setUser]    = useState(()=>{
    try{ const s=localStorage.getItem("gymbro_user"); return s?JSON.parse(s):null; }catch{return null;}
  });
  const [tab,     setTab]     = useState("home");
  const [saved,   setSaved]   = useState(null);
  const [history, setHistory] = useState([]);
  const [stats,   setStats]   = useState({total:0,week:0,streak:0});
  const [showProfile, setShowProfile] = useState(false);

  const handleUserSave = (u) => {
    localStorage.setItem("gymbro_user", JSON.stringify(u));
    setUser(u); setShowProfile(false);
  };
  const handleCreated = (w) => { setSaved(w); setTab("home"); };
  const handleDone    = (r) => {
    const nh=[...history,r]; setHistory(nh);
    const week=nh.filter(h=>(new Date()-new Date(h.completedAt))<7*86400000).length;
    setStats({total:nh.length,week,streak:Math.min(nh.length,7)});
  };

  if(!user) return (
    <>
      <style>{GLOBAL_CSS}</style>
      <OnboardingScreen onComplete={u=>{ localStorage.setItem("gymbro_user",JSON.stringify(u)); setUser(u); }}/>
    </>
  );

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {showProfile&&<ProfileModal user={user} onSave={handleUserSave} onClose={()=>setShowProfile(false)}/>}

      {/* ambient gradient blobs */}
      <div style={{ position:"fixed",top:-200,left:-150,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,.08) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"float 12s ease-in-out infinite" }}/>
      <div style={{ position:"fixed",bottom:-200,right:-150,width:450,height:450,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,208,132,.06) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"float 14s ease-in-out infinite 2s" }}/>

      <div style={{ display:"flex", justifyContent:"center", background:"linear-gradient(135deg, var(--bg-dark) 0%, #0f1435 100%)", minHeight:"100vh" }}>
        <div style={{ width:"100%", maxWidth:540, display:"flex", flexDirection:"column", position:"relative", zIndex:1 }}>
          <Header user={user} onEditProfile={()=>setShowProfile(true)}/>
          <div style={{ flex:1, paddingBottom:24 }}>
            <div key={tab} className="slideInDown" style={{ minHeight:"100%" }}>
              {tab==="home"    && <HomeScreen    user={user} onStart={()=>setTab("workout")} savedWorkout={saved} stats={stats}/>}
              {tab==="create"  && <BuildScreen   user={user} onWorkoutCreated={handleCreated}/>}
              {tab==="workout" && <WorkoutScreen workout={saved} onComplete={handleDone}/>}
              {tab==="history" && <HistoryScreen history={history}/>}
            </div>
          </div>
          <TabBar active={tab} onChange={setTab}/>
        </div>
      </div>
    </>
  );
}