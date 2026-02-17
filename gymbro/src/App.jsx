import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL STYLES ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:        #0b1628;
    --navy2:       #0f1e35;
    --navy3:       #162640;
    --green:       #1db37e;
    --green2:      #25d494;
    --green3:      #0e9965;
    --teal:        #17c8a3;
    --glow:        rgba(29,179,126,0.35);
    --glow2:       rgba(29,179,126,0.15);
    --glass:       rgba(255,255,255,0.04);
    --glass2:      rgba(255,255,255,0.07);
    --border:      rgba(255,255,255,0.07);
    --border2:     rgba(29,179,126,0.3);
    --text:        #e8f4f0;
    --text2:       #8baaa0;
    --text3:       #4a6b60;
    --radius:      18px;
    --radius-sm:   12px;
    --radius-pill: 50px;
    --font:        'Nunito', sans-serif;
    --font2:       'Outfit', sans-serif;
    --pad:         20px;
  }

  html {
    scroll-behavior: smooth;
    overflow-y: scroll; /* always reserve scrollbar space — prevents layout shift on tab switch */
  }
  body {
    background: var(--navy);
    color: var(--text);
    font-family: var(--font);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--green3); border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes tabFade {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse   { 0%,100%{box-shadow:0 0 0 0 var(--glow);}50%{box-shadow:0 0 0 10px transparent;} }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes ripple  { 0%{transform:scale(0);opacity:.5;}100%{transform:scale(4);opacity:0;} }
  @keyframes slideIn { from{opacity:0;transform:translateX(24px);}to{opacity:1;transform:translateX(0);} }
  @keyframes popIn   { 0%{transform:scale(.85);opacity:0;}70%{transform:scale(1.04);}100%{transform:scale(1);opacity:1;} }
  @keyframes float   { 0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);} }
  @keyframes gradientShift { 0%{background-position:0% 50%;}100%{background-position:200% 50%;} }

  .fadeUp  { animation: fadeUp  .3s ease both; }
  .tabFade { animation: tabFade .3s cubic-bezier(.25,.46,.45,.94) both; }
  .fadeIn  { animation: fadeIn  .35s ease both; }
  .popIn   { animation: popIn   .4s  cubic-bezier(.34,1.56,.64,1) both; }
  .slideIn { animation: slideIn .35s cubic-bezier(.34,1.2,.64,1) both; }

  .card {
    background: var(--glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: border-color .2s ease, box-shadow .2s ease, transform .25s cubic-bezier(.34,1.56,.64,1);
  }
  .card:hover { border-color: var(--border2); box-shadow: 0 8px 28px var(--glow2); }
  .hover-lift:hover { transform: translateY(-3px); }

  .option-btn {
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    color: var(--text2);
    font-family: var(--font);
    font-weight: 700;
    font-size: 14px;
    padding: 14px 20px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all .2s ease;
    position: relative;
    overflow: hidden;
  }
  .option-btn:hover  { border-color:var(--green); color:var(--text); background:rgba(29,179,126,.08); transform:translateX(4px); }
  .option-btn.sel    { border-color:var(--green); background:rgba(29,179,126,.12); color:var(--green2); box-shadow:0 0 20px var(--glow2); }
  .option-btn:active { transform:scale(.97); }

  .primary-btn {
    background: linear-gradient(135deg, var(--green3), var(--green), var(--teal), var(--green3));
    background-size: 300% 300%;
    background-position: 0% 50%;
    border: none;
    border-radius: var(--radius-pill);
    color: #fff;
    font-family: var(--font);
    font-weight: 800;
    font-size: 15px;
    letter-spacing: .4px;
    padding: 16px 0;
    width: 100%;
    cursor: pointer;
    transition: background-position .5s ease, box-shadow .3s ease, transform .2s ease;
    box-shadow: 0 4px 24px var(--glow);
    position: relative;
    overflow: hidden;
  }
  .primary-btn:hover  { background-position:100% 50%; box-shadow:0 8px 36px var(--glow); transform:translateY(-2px); }
  .primary-btn:active { transform:scale(.97) !important; }
  .primary-btn:disabled { opacity:.4; cursor:not-allowed; transform:none !important; }

  .ghost-btn {
    background: none;
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    color: var(--text3);
    font-family: var(--font);
    font-weight: 700;
    font-size: 13px;
    padding: 12px 0;
    width: 100%;
    cursor: pointer;
    transition: border-color .2s, color .2s, transform .2s;
  }
  .ghost-btn:hover  { border-color:var(--green3); color:var(--text2); }
  .ghost-btn:active { transform:scale(.97); }

  .ripple-container { position:relative; overflow:hidden; }
  .ripple-el {
    position:absolute; border-radius:50%;
    background:rgba(255,255,255,.18);
    animation:ripple .55s ease-out forwards;
    pointer-events:none;
  }

  .set-dot { transition:background .3s, transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s; }
  .set-dot.done    { background:var(--green)!important; box-shadow:0 0 10px var(--glow2); transform:scale(1.2); }
  .set-dot.current { background:rgba(29,179,126,.45)!important; animation:pulse 1.6s infinite; }

  .text-input {
    width:100%; background:var(--glass2); border:1px solid var(--border);
    border-radius: var(--radius); color:var(--text); font-family:var(--font);
    font-size:16px; font-weight:600; padding:16px 18px;
    outline:none; transition:border-color .2s, box-shadow .2s;
  }
  .text-input::placeholder { color:var(--text3); }
  .text-input:focus { border-color:var(--green); box-shadow:0 0 0 3px var(--glow2); }

  .sex-btn {
    flex:1; background:var(--glass); border:1px solid var(--border);
    border-radius:var(--radius); color:var(--text2); font-family:var(--font);
    font-weight:700; font-size:14px; padding:18px 12px; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:8px;
    transition:all .2s ease;
  }
  .sex-btn:hover { border-color:var(--green3); background:rgba(29,179,126,.06); }
  .sex-btn.sel   { border-color:var(--green); background:rgba(29,179,126,.12); color:var(--green2); box-shadow:0 0 20px var(--glow2); }
  .sex-btn:active { transform:scale(.96); }

  .env-btn {
    flex:1; background:var(--glass); border:1px solid var(--border);
    border-radius:var(--radius); color:var(--text2); font-family:var(--font);
    font-weight:700; font-size:13px; padding:20px 12px; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:10px;
    transition:all .2s ease; text-align:center;
  }
  .env-btn:hover { border-color:var(--green3); background:rgba(29,179,126,.06); }
  .env-btn.sel   { border-color:var(--green); background:rgba(29,179,126,.12); color:var(--green2); box-shadow:0 0 20px var(--glow2); }
  .env-btn:active { transform:scale(.96); }

  .tab-btn { transition:color .2s, background .2s, transform .3s cubic-bezier(.34,1.56,.64,1); }
  .tab-btn:active { transform:scale(.85); }

  /* Progress bar smooth fill */
  .prog-fill { transition: width .6s cubic-bezier(.34,1.2,.64,1); }
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
function GlassCard({ children, style, className="", onClick, delay=0 }) {
  const ref = useRef(); const ripple = useRipple();
  return (
    <div ref={ref} className={`card ripple-container ${className}`}
      style={{ animationDelay:`${delay}ms`, ...style }}
      onClick={e => { if(onClick){ ripple(e,ref); onClick(e); } }}>
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, style, disabled }) {
  const ref = useRef(); const ripple = useRipple();
  return (
    <button ref={ref} className="primary-btn ripple-container" style={style} disabled={disabled}
      onClick={e => { ripple(e,ref); onClick&&onClick(e); }}>
      {children}
    </button>
  );
}

function StatBadge({ label, value, unit="", color="var(--green)", delay=0 }) {
  return (
    <GlassCard delay={delay} style={{ flex:1, padding:"14px 8px", textAlign:"center" }}>
      <div style={{ fontFamily:"var(--font2)", fontSize:24, fontWeight:700, color, lineHeight:1 }}>
        {value}<span style={{ fontSize:12, marginLeft:2 }}>{unit}</span>
      </div>
      <div style={{ fontSize:9, color:"var(--text3)", letterSpacing:1.5, marginTop:5, fontWeight:700, fontFamily:"var(--font2)", textTransform:"uppercase" }}>
        {label}
      </div>
    </GlassCard>
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
      <div style={{ fontSize:13, color:"var(--text3)", fontWeight:700, letterSpacing:1.5, marginBottom:8, textTransform:"uppercase" }}>Step 1 of 3</div>
      <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:26, marginBottom:6, lineHeight:1.2 }}>What's your name?</div>
      <div style={{ fontSize:14, color:"var(--text3)", marginBottom:28 }}>We'll use it to personalise your experience</div>
      <input
        ref={inputRef}
        className="text-input"
        placeholder="Enter your name…"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && name.trim() && next()}
        autoFocus
        style={{ marginBottom:16 }}
      />
      <PrimaryBtn onClick={next} disabled={!name.trim()}>Continue →</PrimaryBtn>
    </div>,

    // Step 1 — Sex
    <div key="sex" className="slideIn" style={{ animationDelay:"0ms" }}>
      <div style={{ fontSize:13, color:"var(--text3)", fontWeight:700, letterSpacing:1.5, marginBottom:8, textTransform:"uppercase" }}>Step 2 of 3</div>
      <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:26, marginBottom:6, lineHeight:1.2 }}>Biological sex</div>
      <div style={{ fontSize:14, color:"var(--text3)", marginBottom:28 }}>Helps tailor workout volume and intensity defaults</div>
      <div style={{ display:"flex", gap:12, marginBottom:16 }}>
        {[{v:"male",icon:"♂️",label:"Male"},{v:"female",icon:"♀️",label:"Female"},{v:"other",icon:"⚧",label:"Other"}].map(o => (
          <button key={o.v} className={`sex-btn ${sex===o.v?"sel":""}`} onClick={() => setSex(o.v)}>
            <span style={{ fontSize:28 }}>{o.icon}</span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>
      <PrimaryBtn onClick={next} disabled={!sex}>Continue →</PrimaryBtn>
      <button className="ghost-btn" style={{ marginTop:10 }} onClick={() => { setStep(0); setKey(k=>k+1); }}>← Back</button>
    </div>,

    // Step 2 — Environment
    <div key="env" className="slideIn" style={{ animationDelay:"0ms" }}>
      <div style={{ fontSize:13, color:"var(--text3)", fontWeight:700, letterSpacing:1.5, marginBottom:8, textTransform:"uppercase" }}>Step 3 of 3</div>
      <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:26, marginBottom:6, lineHeight:1.2 }}>Where do you train?</div>
      <div style={{ fontSize:14, color:"var(--text3)", marginBottom:28 }}>We'll generate workouts using the right equipment</div>
      <div style={{ display:"flex", gap:12, marginBottom:16 }}>
        {[
          {v:"gym",  icon:"🏋️", label:"Gym",  sub:"Barbells, machines, cables"},
          {v:"home", icon:"🏠", label:"Home", sub:"Bodyweight & minimal gear"},
        ].map(o => (
          <button key={o.v} className={`env-btn ${env===o.v?"sel":""}`} onClick={() => setEnv(o.v)}>
            <span style={{ fontSize:36 }}>{o.icon}</span>
            <span style={{ fontWeight:800, fontSize:15 }}>{o.label}</span>
            <span style={{ fontSize:11, color:"var(--text3)", fontWeight:500 }}>{o.sub}</span>
          </button>
        ))}
      </div>
      <PrimaryBtn onClick={handleDone} disabled={!env}>Let's Go 🔥</PrimaryBtn>
      <button className="ghost-btn" style={{ marginTop:10 }} onClick={() => { setStep(1); setKey(k=>k+1); }}>← Back</button>
    </div>,
  ];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px var(--pad)", position:"relative" }}>
      {/* bg blobs */}
      <div style={{ position:"fixed", top:-100, left:-60, width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(29,179,126,.1) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:-80, right:-40, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(23,200,163,.07) 0%,transparent 70%)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:440 }}>
        {/* Logo */}
        <div className="fadeUp" style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{
            width:72, height:72, borderRadius:24, margin:"0 auto 16px",
            background:"linear-gradient(135deg,var(--green3),var(--teal))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:36, boxShadow:"0 8px 32px var(--glow)",
            animation:"float 3s ease-in-out infinite",
          }}>💪</div>
          <div style={{
            fontFamily:"var(--font2)", fontWeight:800, fontSize:34,
            background:"linear-gradient(135deg,var(--green2),var(--teal))",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            letterSpacing:"-0.5px", marginBottom:6,
          }}>GymBro</div>
          <div style={{ fontSize:14, color:"var(--text3)" }}>Your AI-powered fitness companion</div>
        </div>

        {/* Step progress dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:36 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: i===step ? 24 : 8, height:8, borderRadius:4,
              background: i<=step ? "var(--green)" : "var(--border)",
              transition:"all .35s cubic-bezier(.34,1.56,.64,1)",
              boxShadow: i===step ? "0 0 10px var(--glow)" : "none",
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
      background:"linear-gradient(180deg,var(--navy) 65%,transparent)",
      position:"sticky", top:0, zIndex:20,
      backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
    }}>
      <div className="fadeUp" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:34, height:34, borderRadius:11,
            background:"linear-gradient(135deg,var(--green3),var(--teal))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:17, boxShadow:"0 4px 14px var(--glow)",
            animation:"float 3s ease-in-out infinite",
          }}>💪</div>
          <div style={{
            fontFamily:"var(--font2)", fontWeight:800, fontSize:24,
            background:"linear-gradient(135deg,var(--green2),var(--teal))",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            letterSpacing:"-0.5px",
          }}>GymBro</div>
        </div>
        {user && (
          <button onClick={onEditProfile} style={{
            display:"flex", alignItems:"center", gap:8,
            background:"var(--glass2)", border:"1px solid var(--border)",
            borderRadius:"var(--radius-pill)", padding:"6px 12px 6px 8px",
            cursor:"pointer", transition:"all .2s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--green3)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; }}
          >
            <div style={{
              width:26, height:26, borderRadius:"50%",
              background:"linear-gradient(135deg,var(--green3),var(--teal))",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, fontWeight:800, color:"white",
            }}>{user.name.charAt(0).toUpperCase()}</div>
            <span style={{ fontSize:13, fontWeight:700, color:"var(--text2)" }}>{user.name.split(" ")[0]}</span>
          </button>
        )}
      </div>
      <div style={{ height:1, background:"linear-gradient(90deg,var(--green3),transparent)", marginTop:10, opacity:.4 }} />
    </div>
  );
}

/* ─── TAB BAR ─── */
function TabBar({ active, onChange }) {
  const tabs=[
    {id:"home",  icon:"⚡", label:"Home"},
    {id:"create",icon:"✦",  label:"Build"},
    {id:"workout",icon:"🔥",label:"Train"},
    {id:"history",icon:"📈",label:"Stats"},
  ];
  return (
    <div style={{
      position:"sticky", bottom:0, width:"100%",
      background:"rgba(11,22,40,.96)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
      borderTop:"1px solid var(--border)",
      display:"flex", zIndex:100, padding:"6px 8px 16px",
    }}>
      {tabs.map(t => {
        const on = active===t.id;
        return (
          <button key={t.id} className="tab-btn" onClick={()=>onChange(t.id)} style={{
            flex:1, background:"none", border:"none", cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"8px 4px",
            color: on ? "var(--green)" : "var(--text3)",
          }}>
            <div style={{
              width:38, height:38, borderRadius:13,
              background: on ? "rgba(29,179,126,.15)" : "transparent",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
              transition:"background .25s, transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s",
              transform: on ? "scale(1.12)" : "scale(1)",
              boxShadow: on ? "0 0 16px var(--glow2)" : "none",
            }}>{t.icon}</div>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:.4, fontFamily:"var(--font2)", opacity: on?1:.45, transition:"opacity .2s" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── HOME ─── */
const TIPS=[
  "Progressive overload is the real secret. Add just a little more each session.",
  "Sleep 7–9 hours — that's when your muscles actually repair and grow.",
  "Aim for 0.8–1g of protein per lb of bodyweight every single day.",
  "Rest 60–90s for hypertrophy, 3–5 min for max strength.",
  "Deload every 4–6 weeks. Recovery is training too.",
];

function HomeScreen({ user, onStart, savedWorkout, stats }) {
  const tip = TIPS[Math.floor(Date.now()/86400000)%TIPS.length];
  const h = new Date().getHours();
  const greeting = h<12?"Good morning":h<17?"Good afternoon":"Good evening";
  const envIcon  = user.environment==="home" ? "🏠" : "🏋️";

  return (
    <div style={{ padding:"20px var(--pad) 0" }}>
      <div className="fadeUp" style={{ marginBottom:22 }}>
        <div style={{ fontSize:12, color:"var(--text3)", fontWeight:600, letterSpacing:.5, marginBottom:4 }}>
          {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
        </div>
        <div style={{ fontFamily:"var(--font2)", fontSize:22, fontWeight:700, lineHeight:1.35 }}>
          {greeting}, <span style={{ background:"linear-gradient(135deg,var(--green2),var(--teal))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{user.name}!</span>
        </div>
        <div style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>
          {envIcon} {user.environment==="home"?"Home workouts":"Gym workouts"} · {user.sex.charAt(0).toUpperCase()+user.sex.slice(1)}
        </div>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:18 }}>
        <StatBadge label="Workouts"  value={stats.total}  delay={50}  />
        <StatBadge label="This Week" value={stats.week}   delay={100} color="var(--teal)" />
        <StatBadge label="Streak"    value={stats.streak} unit="🔥"   delay={150} color="#ffaa44" />
      </div>

      {savedWorkout ? (
        <GlassCard delay={180} style={{
          padding:20, marginBottom:18,
          border:"1px solid var(--border2)",
          background:"linear-gradient(135deg,rgba(29,179,126,.07),rgba(11,22,40,.5))",
          boxShadow:"0 8px 28px var(--glow2)",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <div style={{ fontSize:10, color:"var(--green)", fontWeight:700, letterSpacing:1.5, marginBottom:5, textTransform:"uppercase" }}>Ready to Go ✓</div>
              <div style={{ fontFamily:"var(--font2)", fontWeight:700, fontSize:19 }}>{savedWorkout.focus}</div>
            </div>
            <div style={{ width:42, height:42, borderRadius:13, background:"rgba(29,179,126,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
              {savedWorkout.environment==="home"?"🏠":"🏋️"}
            </div>
          </div>
          <div style={{ display:"flex", gap:7, marginBottom:16, flexWrap:"wrap" }}>
            {[savedWorkout.goal, savedWorkout.level, savedWorkout.duration, savedWorkout.environment==="home"?"Home":"Gym"].map(tag => (
              <span key={tag} style={{ background:"rgba(29,179,126,.1)", border:"1px solid var(--border2)", padding:"3px 11px", borderRadius:20, fontSize:11, color:"var(--green2)", fontWeight:600 }}>{tag}</span>
            ))}
          </div>
          <PrimaryBtn onClick={onStart}>Start Session →</PrimaryBtn>
        </GlassCard>
      ) : (
        <GlassCard delay={180} style={{ padding:28, marginBottom:18, textAlign:"center", border:"1px dashed var(--border)" }}>
          <div style={{ fontSize:38, marginBottom:10, animation:"float 3s ease-in-out infinite" }}>🏗️</div>
          <div style={{ fontFamily:"var(--font2)", fontWeight:700, fontSize:16, marginBottom:5 }}>No Workout Built Yet</div>
          <div style={{ fontSize:13, color:"var(--text3)" }}>Head to Build tab to generate your personalised plan</div>
        </GlassCard>
      )}

      <GlassCard delay={250} style={{ padding:16 }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ width:34, height:34, borderRadius:11, flexShrink:0, background:"rgba(29,179,126,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>💡</div>
          <div>
            <div style={{ fontSize:10, color:"var(--green)", fontWeight:700, letterSpacing:1.5, marginBottom:4, textTransform:"uppercase" }}>Coach Tip</div>
            <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.65, fontStyle:"italic" }}>"{tip}"</div>
          </div>
        </div>
      </GlassCard>
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
    {title:"What's your goal?",      sub:"Choose what you're training for",         options:GOALS,     val:goal,     set:v=>{setGoal(v);    next();}},
    {title:"Your experience level",  sub:"Be honest — it shapes your program",      options:LEVELS,    val:level,    set:v=>{setLevel(v);   next();}},
    {title:"How long do you have?",  sub:"We'll build a great session in any window",options:DURATIONS, val:duration, set:v=>{setDuration(v);next();}},
    {title:"Focus area",             sub:"What are we hitting today?",              options:FOCUS,     val:focus,    set:v=>setFocus(v)},
  ];

  const generate = async () => {
    setGen(true); setAiMsg("");
    const envNote = user.environment==="home"
      ? "They train at HOME — use bodyweight and minimal equipment only."
      : "They train at the GYM — barbells, machines, cables available.";
    const sexNote = user.sex==="female" ? "slightly higher rep ranges and more hip-dominant exercises" : user.sex==="male" ? "compound-heavy programming" : "balanced programming";
    const prompt = `You are GymBro, an elite AI fitness coach. User profile: Name=${user.name}, Sex=${user.sex}, Environment=${user.environment}. Workout request: Goal=${goal}, Level=${level}, Duration=${duration}, Focus=${focus}. ${envNote} Tailor advice for ${sexNote}. Write a punchy, personalised 2-sentence motivational intro calling them by first name. Max 55 words. Be energetic.`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]}),
      });
      const d = await r.json();
      setAiMsg(d.content?.map(b=>b.text||"").join("")||"");
    } catch { setAiMsg(`Let's get it, ${user.name}. Your ${focus} ${user.environment} session is locked in — no excuses.`); }
    setTimeout(()=>{ setWorkout(buildWorkout(user,goal,level,duration,focus)); setGen(false); },1200);
  };

  if (gen) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, padding:"40px var(--pad)" }}>
      <div style={{
        width:68, height:68, borderRadius:22,
        background:"linear-gradient(135deg,var(--green3),var(--teal))",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:30, marginBottom:20, animation:"spin 1.2s linear infinite",
        boxShadow:"0 0 32px var(--glow)",
      }}>⚡</div>
      <div style={{ fontFamily:"var(--font2)", fontWeight:700, fontSize:20, marginBottom:6 }}>Building Your Plan</div>
      <div style={{ color:"var(--text3)", fontSize:13 }}>Personalising for {user.name}…</div>
    </div>
  );

  if (workout) return (
    <div style={{ padding:"20px var(--pad) 0" }}>
      {aiMsg && (
        <GlassCard delay={0} style={{ padding:16, marginBottom:18, border:"1px solid rgba(29,179,126,.3)", background:"rgba(29,179,126,.05)" }}>
          <div style={{ fontSize:10, color:"var(--green)", fontWeight:700, letterSpacing:1.5, marginBottom:5, textTransform:"uppercase" }}>🤖 GymBro AI</div>
          <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.65, fontStyle:"italic" }}>{aiMsg}</div>
        </GlassCard>
      )}
      <div className="fadeUp" style={{ marginBottom:16 }}>
        <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:21, marginBottom:8 }}>{workout.focus} Program</div>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          {[workout.goal,workout.level,workout.duration,workout.environment==="home"?"🏠 Home":"🏋️ Gym"].map(t=>(
            <span key={t} style={{ background:"rgba(29,179,126,.1)", border:"1px solid var(--border2)", padding:"4px 11px", borderRadius:20, fontSize:11, color:"var(--green2)", fontWeight:600 }}>{t}</span>
          ))}
        </div>
      </div>

      {["warmup","main","cooldown"].map((ph,pi)=>(
        <div key={ph} style={{ marginBottom:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ fontFamily:"var(--font2)", fontWeight:700, fontSize:11, letterSpacing:1.5, color:ph==="main"?"var(--green)":"var(--text3)", textTransform:"uppercase" }}>
              {ph==="warmup"?"🔥 Warm Up":ph==="main"?"⚡ Main Workout":"❄️ Cool Down"}
            </div>
            <div style={{ flex:1, height:1, background:ph==="main"?"var(--border2)":"var(--border)" }} />
          </div>
          {workout[ph].map((ex,i)=>(
            <GlassCard key={i} delay={i*50+pi*60} className="card hover-lift" style={{ padding:"13px 15px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:11, alignItems:"center" }}>
                <div style={{ width:36, height:36, borderRadius:11, background:"rgba(29,179,126,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{ex.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{ex.name}</div>
                  {ex.muscle&&<div style={{ fontSize:10, color:"var(--green)", fontWeight:700, letterSpacing:.5, marginTop:2 }}>{ex.muscle}</div>}
                  <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{ex.notes}</div>
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0, marginLeft:10 }}>
                <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:15, color:"var(--green2)" }}>{ex.sets}×{ex.reps}</div>
                {ex.rest>0&&<div style={{ fontSize:10, color:"var(--text3)", marginTop:2 }}>{ex.rest}s rest</div>}
              </div>
            </GlassCard>
          ))}
        </div>
      ))}

      <div style={{ padding:"0 0 8px" }}>
        <PrimaryBtn onClick={()=>onWorkoutCreated(workout)} style={{ marginBottom:10 }}>Save This Workout ✓</PrimaryBtn>
        <button className="ghost-btn" onClick={()=>setWorkout(null)}>← Rebuild</button>
      </div>
    </div>
  );

  const cur = steps[step];
  return (
    <div style={{ padding:"20px var(--pad) 0" }}>
      <div style={{ display:"flex", gap:6, marginBottom:24 }}>
        {steps.map((_,i)=>(
          <div key={i} style={{
            flex:1, height:4, borderRadius:4,
            background:i<step?"var(--green)":i===step?"var(--green2)":"var(--border)",
            transition:"background .4s ease",
            boxShadow:i<=step?"0 0 8px var(--glow2)":"none",
          }}/>
        ))}
      </div>
      <div key={key} className="slideIn" style={{ marginBottom:22 }}>
        <div style={{ fontSize:11, color:"var(--text3)", fontWeight:700, letterSpacing:1.5, marginBottom:5, textTransform:"uppercase" }}>Step {step+1} of {steps.length}</div>
        <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:24, marginBottom:4 }}>{cur.title}</div>
        <div style={{ fontSize:13, color:"var(--text3)" }}>{cur.sub}</div>
      </div>
      <div key={`o-${key}`} style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22 }}>
        {cur.options.map((opt,i)=>(
          <button key={opt} className={`option-btn fadeUp ${cur.val===opt?"sel":""}`} onClick={()=>cur.set(opt)}>
            <span>{opt}</span>
            {cur.val===opt&&<span>✓</span>}
          </button>
        ))}
      </div>
      {step===3&&focus&&<PrimaryBtn onClick={generate}>Generate My Workout ⚡</PrimaryBtn>}
      {step>0&&<button className="ghost-btn" style={{ marginTop:10 }} onClick={()=>{setStep(s=>s-1);setKey(k=>k+1);}}>← Back</button>}
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
  const R=54, circ=2*Math.PI*R;
  return (
    <div className="fadeIn" style={{ position:"fixed",inset:0,background:"rgba(11,22,40,.96)",backdropFilter:"blur(16px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:300 }}>
      <GlassCard style={{ padding:"40px 48px", textAlign:"center", border:"1px solid var(--border2)", boxShadow:"0 0 60px var(--glow2)" }}>
        <div style={{ fontSize:12, color:"var(--text3)", fontWeight:700, letterSpacing:2, marginBottom:20, textTransform:"uppercase" }}>Rest Period</div>
        <div style={{ position:"relative", width:130, height:130, margin:"0 auto 20px" }}>
          <svg width={130} height={130} style={{ position:"absolute",top:0,left:0 }}>
            <circle cx={65} cy={65} r={R} fill="none" stroke="var(--border)" strokeWidth={6}/>
            <circle cx={65} cy={65} r={R} fill="none" stroke="var(--green)" strokeWidth={6}
              strokeDasharray={circ} strokeDashoffset={circ*(1-rem/seconds)}
              strokeLinecap="round" transform="rotate(-90 65 65)"
              style={{transition:"stroke-dashoffset 1s linear",filter:"drop-shadow(0 0 8px var(--green))"}}
            />
          </svg>
          <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
            <div style={{ fontFamily:"var(--font2)",fontWeight:800,fontSize:36,lineHeight:1 }}>{rem}</div>
            <div style={{ fontSize:10,color:"var(--text3)",fontWeight:600,letterSpacing:1 }}>sec</div>
          </div>
        </div>
        <button onClick={onDone} style={{
          background:"rgba(29,179,126,.12)", border:"1px solid var(--border2)",
          color:"var(--green)", padding:"10px 28px", borderRadius:50,
          cursor:"pointer", fontFamily:"var(--font)", fontWeight:700, fontSize:13,
          transition:"background .2s, transform .2s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(29,179,126,.22)";e.currentTarget.style.transform="scale(1.05)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(29,179,126,.12)";e.currentTarget.style.transform="scale(1)";}}
        >Skip Rest</button>
      </GlassCard>
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
      <div style={{ fontSize:48, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>💪</div>
      <div style={{ fontFamily:"var(--font2)", fontWeight:700, fontSize:20, marginBottom:8 }}>No Workout Loaded</div>
      <div style={{ color:"var(--text3)", fontSize:13 }}>Go to Build tab to create your workout first</div>
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
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`GymBro AI coach: Give ONE ultra-short (max 15 words) form cue or motivational tip for: ${ex.name}. Bold and specific.`}]}),
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
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:420,padding:"40px var(--pad) 0" }}>
      <div className="popIn" style={{ textAlign:"center" }}>
        <div style={{ fontSize:72, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>🏆</div>
        <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:28, marginBottom:6, background:"linear-gradient(135deg,var(--green2),var(--teal))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Session Complete!</div>
        <div style={{ color:"var(--text3)", fontSize:14, marginBottom:28 }}>You crushed it. Rest, eat, grow. 💪</div>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <GlassCard style={{ padding:"16px 22px", textAlign:"center" }}>
            <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:26, color:"var(--green)" }}>{doneSets}</div>
            <div style={{ fontSize:10, color:"var(--text3)", fontWeight:700, letterSpacing:1, marginTop:4, textTransform:"uppercase" }}>Sets Done</div>
          </GlassCard>
          <GlassCard style={{ padding:"16px 22px", textAlign:"center" }}>
            <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:26, color:"var(--teal)" }}>{workout.estimatedCalories}</div>
            <div style={{ fontSize:10, color:"var(--text3)", fontWeight:700, letterSpacing:1, marginTop:4, textTransform:"uppercase" }}>Est. Cals</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"20px var(--pad) 0" }}>
      {resting&&<RestTimer seconds={ex.rest} onDone={afterRest}/>}

      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <div style={{ fontSize:11, color:"var(--text3)", fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>{phase} · {ei+1}/{exs.length}</div>
          <div style={{ fontSize:11, color:"var(--green)", fontWeight:800 }}>{Math.round(progress*100)}%</div>
        </div>
        <div style={{ height:5, background:"var(--glass2)", borderRadius:5, overflow:"hidden" }}>
          <div className="prog-fill" style={{ height:"100%", width:`${progress*100}%`, background:"linear-gradient(90deg,var(--green3),var(--green2))", borderRadius:5, boxShadow:"0 0 10px var(--glow)" }}/>
        </div>
      </div>

      <GlassCard key={cKey} delay={0} style={{
        padding:22, marginBottom:14,
        border:"1px solid var(--border2)",
        background:"linear-gradient(135deg,rgba(29,179,126,.06),rgba(11,22,40,.4))",
        boxShadow:"0 8px 36px var(--glow2)",
      }}>
        <div style={{ display:"flex", gap:13, alignItems:"flex-start", marginBottom:16 }}>
          <div style={{ width:50, height:50, borderRadius:16, background:"rgba(29,179,126,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, boxShadow:"0 4px 14px var(--glow2)" }}>{ex.icon}</div>
          <div>
            {ex.muscle&&<div style={{ fontSize:10, color:"var(--green)", fontWeight:700, letterSpacing:1.5, marginBottom:3, textTransform:"uppercase" }}>{ex.muscle}</div>}
            <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:21, lineHeight:1.1 }}>{ex.name}</div>
          </div>
        </div>

        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          {[{l:"Reps",v:ex.reps},{l:"Set",v:`${si+1}/${ex.sets}`},...(ex.rest>0?[{l:"Rest",v:`${ex.rest}s`}]:[])].map((item,i)=>(
            <div key={i} style={{ flex:1, background:"rgba(255,255,255,.04)", borderRadius:13, padding:"11px 6px", textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:19, color:"var(--green2)", lineHeight:1 }}>{item.v}</div>
              <div style={{ fontSize:9, color:"var(--text3)", fontWeight:700, letterSpacing:1, marginTop:4, textTransform:"uppercase" }}>{item.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:5, marginBottom:16 }}>
          {Array.from({length:ex.sets}).map((_,i)=>(
            <div key={i} className={`set-dot ${i<si?"done":i===si?"current":""}`} style={{
              flex:1, height:7, borderRadius:4,
              background:i<si?"var(--green)":i===si?"rgba(29,179,126,.4)":"var(--border)",
            }}/>
          ))}
        </div>

        <div style={{ background:"rgba(0,0,0,.2)", borderRadius:12, padding:"10px 13px", display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:14 }}>🤖</span>
          <span style={{ fontSize:12, color:"var(--text2)", lineHeight:1.5, fontStyle:"italic" }}>
            {tipLoad?<span style={{color:"var(--text3)"}}>Loading tip…</span>:(aiTip||ex.notes)}
          </span>
        </div>
      </GlassCard>

      <PrimaryBtn onClick={handleSet}>Set Complete ✓</PrimaryBtn>

      {(ei>0||pi>0)&&(
        <button className="ghost-btn" style={{ marginTop:10 }} onClick={()=>{
          if(ei>0){setEi(i=>i-1);setSi(0);}
          else if(pi>0){setPi(p=>p-1);setEi(workout[PHASES[pi-1]].length-1);setSi(0);}
        }}>← Previous exercise</button>
      )}
    </div>
  );
}

/* ─── HISTORY ─── */
function HistoryScreen({ history }) {
  if(!history.length) return (
    <div style={{ padding:40, textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>📈</div>
      <div style={{ fontFamily:"var(--font2)", fontWeight:700, fontSize:20, marginBottom:8 }}>No Data Yet</div>
      <div style={{ color:"var(--text3)", fontSize:13 }}>Complete a workout to see your stats here</div>
    </div>
  );
  const total=history.length;
  const week=history.filter(h=>(new Date()-new Date(h.completedAt))<7*86400000).length;
  const sets=history.reduce((a,h)=>a+Object.values(h.log||{}).reduce((b,v)=>b+v,0),0);
  return (
    <div style={{ padding:"20px var(--pad) 0" }}>
      <div className="fadeUp" style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:22, marginBottom:18 }}>Your Stats</div>
      <div style={{ display:"flex", gap:10, marginBottom:22 }}>
        <StatBadge label="Total"     value={total} delay={0}   />
        <StatBadge label="This Week" value={week}  delay={60}  color="var(--teal)"/>
        <StatBadge label="Sets Done" value={sets}  delay={120} color="#ffaa44"/>
      </div>
      <div style={{ fontSize:11, color:"var(--text3)", fontWeight:700, letterSpacing:1.5, marginBottom:12, textTransform:"uppercase" }}>Recent Sessions</div>
      {[...history].reverse().slice(0,10).map((h,i)=>(
        <GlassCard key={i} delay={i*55} className="card hover-lift" style={{ padding:"13px 15px", marginBottom:9, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:11, alignItems:"center" }}>
            <div style={{ width:38, height:38, borderRadius:12, background:"rgba(29,179,126,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>
              {h.workout?.environment==="home"?"🏠":"🏋️"}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14 }}>{h.workout?.focus}</div>
              <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>
                {new Date(h.completedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})} · {h.workout?.duration}
              </div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:15, color:"var(--green)" }}>{Object.values(h.log||{}).reduce((a,v)=>a+v,0)} sets</div>
            <div style={{ fontSize:10, color:"var(--green3)", fontWeight:700, marginTop:2 }}>✓ Done</div>
          </div>
        </GlassCard>
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
    <div className="fadeIn" style={{ position:"fixed",inset:0,background:"rgba(11,22,40,.92)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:"20px var(--pad)" }}>
      <GlassCard style={{ width:"100%", maxWidth:420, padding:28, border:"1px solid var(--border2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div style={{ fontFamily:"var(--font2)", fontWeight:800, fontSize:20 }}>Edit Profile</div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"var(--text3)",fontSize:22,cursor:"pointer",lineHeight:1,padding:4 }}>✕</button>
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:"var(--text3)", fontWeight:700, letterSpacing:1.5, marginBottom:8, textTransform:"uppercase" }}>Name</div>
          <input className="text-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/>
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:"var(--text3)", fontWeight:700, letterSpacing:1.5, marginBottom:8, textTransform:"uppercase" }}>Biological Sex</div>
          <div style={{ display:"flex", gap:8 }}>
            {[{v:"male",icon:"♂️",label:"Male"},{v:"female",icon:"♀️",label:"Female"},{v:"other",icon:"⚧",label:"Other"}].map(o=>(
              <button key={o.v} className={`sex-btn ${sex===o.v?"sel":""}`} onClick={()=>setSex(o.v)} style={{ padding:"12px 8px" }}>
                <span style={{fontSize:22}}>{o.icon}</span>
                <span style={{fontSize:12}}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, color:"var(--text3)", fontWeight:700, letterSpacing:1.5, marginBottom:8, textTransform:"uppercase" }}>Training Environment</div>
          <div style={{ display:"flex", gap:8 }}>
            {[{v:"gym",icon:"🏋️",label:"Gym"},{v:"home",icon:"🏠",label:"Home"}].map(o=>(
              <button key={o.v} className={`env-btn ${env===o.v?"sel":""}`} onClick={()=>setEnv(o.v)} style={{ padding:"14px 12px" }}>
                <span style={{fontSize:28}}>{o.icon}</span>
                <span style={{fontWeight:800,fontSize:14}}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
        <PrimaryBtn onClick={()=>{ if(name.trim()&&sex&&env) onSave({name:name.trim(),sex,environment:env}); }} disabled={!name.trim()||!sex||!env}>Save Changes ✓</PrimaryBtn>
        <button className="ghost-btn" style={{marginTop:10}} onClick={onClose}>Cancel</button>
      </GlassCard>
    </div>
  );
}


/* ─── LANDING PAGE ─── */
function LandingScreen({ onEnter }) {
  useEffect(() => {
    // Scroll reveal
    const els = document.querySelectorAll(".lreveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("lvisible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    els.forEach(el => obs.observe(el));

    // Nav darken on scroll
    const nav = document.getElementById("l-nav");
    const onScroll = () => {
      if (nav) nav.style.background = window.scrollY > 50 ? "rgba(8,12,20,0.97)" : "rgba(8,12,20,0.7)";
    };
    window.addEventListener("scroll", onScroll);
    return () => { obs.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div style={{ background:"#080c14", color:"#f0f7f4", fontFamily:"var(--font2)", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        .lreveal { opacity:0; transform:translateY(28px); transition:opacity .8s cubic-bezier(.25,.46,.45,.94), transform .8s cubic-bezier(.25,.46,.45,.94); }
        .lreveal.lvisible { opacity:1; transform:translateY(0); }
        .ld1{transition-delay:.1s} .ld2{transition-delay:.2s} .ld3{transition-delay:.3s} .ld4{transition-delay:.4s}
        @keyframes lfloat { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-14px) rotate(1deg);} }
        @keyframes lgradShift { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
        @keyframes lpulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.4;transform:scale(.8);} }
        @keyframes lrevealAnim { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes lscroll { 0%,100%{opacity:1;transform:scaleY(1);} 50%{opacity:.2;transform:scaleY(.5);} }
        .l-nav { position:fixed;top:0;left:0;right:0;z-index:900;display:flex;align-items:center;justify-content:space-between;padding:0 6%;height:62px;background:rgba(8,12,20,.7);backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,255,255,.05);transition:background .3s; }
        .l-nav-logo { display:flex;align-items:center;gap:9px;font-weight:800;font-size:19px;background:linear-gradient(135deg,#25d494,#17c8a3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;cursor:pointer; }
        .l-nav-icon { width:29px;height:29px;border-radius:9px;background:linear-gradient(135deg,#0e9965,#17c8a3);display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 12px rgba(29,179,126,.3); }
        .l-nav-links { display:flex;align-items:center;gap:28px; }
        .l-nav-links a { color:#7a9e94;text-decoration:none;font-size:13px;font-weight:500;transition:color .2s; }
        .l-nav-links a:hover { color:#f0f7f4; }
        .l-nav-cta { background:linear-gradient(135deg,#0e9965,#25d494);color:white;border:none;border-radius:50px;padding:9px 20px;font-family:var(--font2);font-weight:700;font-size:13px;cursor:pointer;transition:box-shadow .3s,transform .2s;box-shadow:0 2px 14px rgba(29,179,126,.3); }
        .l-nav-cta:hover { box-shadow:0 4px 24px rgba(29,179,126,.5);transform:translateY(-1px); }
        .l-btn-primary { background:linear-gradient(135deg,#0e9965,#25d494);color:white;border:none;border-radius:50px;padding:15px 34px;font-family:var(--font2);font-weight:700;font-size:15px;cursor:pointer;transition:box-shadow .3s,transform .2s;box-shadow:0 4px 28px rgba(29,179,126,.4); }
        .l-btn-primary:hover { box-shadow:0 8px 40px rgba(29,179,126,.6);transform:translateY(-2px); }
        .l-btn-ghost { background:rgba(255,255,255,.05);color:#f0f7f4;border:1px solid rgba(255,255,255,.08);border-radius:50px;padding:15px 34px;font-family:var(--font2);font-weight:600;font-size:15px;cursor:pointer;transition:all .2s; }
        .l-btn-ghost:hover { border-color:rgba(29,179,126,.4);background:rgba(29,179,126,.07);transform:translateY(-2px); }
        .l-bento-card { background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:22px;padding:32px;transition:border-color .3s,box-shadow .3s,transform .3s;position:relative;overflow:hidden; }
        .l-bento-card:hover { border-color:rgba(29,179,126,.25);box-shadow:0 16px 48px rgba(0,0,0,.3),0 0 40px rgba(29,179,126,.12);transform:translateY(-4px); }
        .l-step { padding:40px 32px;background:#0f1e35;position:relative;transition:background .3s; }
        .l-step:hover { background:#162640; }
        .l-testimonial { background:#0f1e35;border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:28px;transition:border-color .3s,transform .3s; }
        .l-testimonial:hover { border-color:rgba(29,179,126,.25);transform:translateY(-3px); }
        @media(max-width:700px){
          .l-nav-links{display:none;}
          .l-bento-grid{grid-template-columns:1fr!important;}
          .l-bento-1,.l-bento-2,.l-bento-3,.l-bento-4,.l-bento-5{grid-column:span 1!important;}
          .l-how-grid{grid-template-columns:1fr!important;}
          .l-stats-grid{grid-template-columns:repeat(2,1fr)!important;}
          .l-test-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* NAV */}
      <nav id="l-nav" className="l-nav">
        <div className="l-nav-logo">
          <div className="l-nav-icon">💪</div>
          GymBro
        </div>
        <div className="l-nav-links">
          <button onClick={()=>document.getElementById("l-features")?.scrollIntoView({behavior:"smooth"})} style={{background:"none",border:"none",color:"#7a9e94",fontSize:"13px",fontWeight:500,cursor:"pointer",transition:"color .2s",fontFamily:"var(--font2)"}} onMouseEnter={e=>e.target.style.color="#f0f7f4"} onMouseLeave={e=>e.target.style.color="#7a9e94"}>Features</button>
          <button onClick={()=>document.getElementById("l-how")?.scrollIntoView({behavior:"smooth"})} style={{background:"none",border:"none",color:"#7a9e94",fontSize:"13px",fontWeight:500,cursor:"pointer",transition:"color .2s",fontFamily:"var(--font2)"}} onMouseEnter={e=>e.target.style.color="#f0f7f4"} onMouseLeave={e=>e.target.style.color="#7a9e94"}>How it works</button>
          <button onClick={()=>document.getElementById("l-testimonials")?.scrollIntoView({behavior:"smooth"})} style={{background:"none",border:"none",color:"#7a9e94",fontSize:"13px",fontWeight:500,cursor:"pointer",transition:"color .2s",fontFamily:"var(--font2)"}} onMouseEnter={e=>e.target.style.color="#f0f7f4"} onMouseLeave={e=>e.target.style.color="#7a9e94"}>Reviews</button>
        </div>
        <button className="l-nav-cta" onClick={(e)=>{ e.stopPropagation(); onEnter(); }}>Get Started Free</button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"100px 5% 60px",position:"relative",overflow:"hidden" }}>
        {/* bg */}
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 50% 40%,rgba(29,179,126,.1) 0%,transparent 70%)",zIndex:0,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(29,179,126,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(29,179,126,.04) 1px,transparent 1px)",backgroundSize:"60px 60px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%)",WebkitMaskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%)",zIndex:0,pointerEvents:"none" }}/>

        {/* eyebrow */}
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(29,179,126,.1)",border:"1px solid rgba(29,179,126,.25)",borderRadius:50,padding:"6px 16px",fontSize:11,fontWeight:700,color:"#25d494",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:26,position:"relative",zIndex:1,animation:"lrevealAnim .8s .1s ease both" }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:"#25d494",boxShadow:"0 0 8px #25d494",animation:"lpulse 2s infinite" }}/>
          AI-Powered Personal Training
        </div>

        <h1 style={{ fontSize:"clamp(50px,9vw,92px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-2px",marginBottom:22,position:"relative",zIndex:1,animation:"lrevealAnim .9s .25s ease both" }}>
          <span style={{ display:"block",color:"#f0f7f4" }}>Train Smarter.</span>
          <span style={{ display:"block",background:"linear-gradient(135deg,#25d494 0%,#17c8a3 50%,#1db37e 100%)",backgroundSize:"200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"lgradShift 4s ease infinite" }}>Get Results.</span>
        </h1>

        <p style={{ fontSize:"clamp(15px,2vw,19px)",color:"#7a9e94",lineHeight:1.75,maxWidth:520,marginBottom:40,position:"relative",zIndex:1,animation:"lrevealAnim .9s .4s ease both" }}>
          GymBro builds your personalised workout, guides you through every set, and holds you accountable — like having a world-class coach in your pocket.
        </p>

        <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",position:"relative",zIndex:10,animation:"lrevealAnim .9s .55s ease both" }}>
          <button className="l-btn-primary" onClick={(e)=>{ e.stopPropagation(); onEnter(); }}>Start Training Free →</button>
          <button className="l-btn-ghost" onClick={()=>document.getElementById("l-how")?.scrollIntoView({behavior:"smooth"})}>See How It Works</button>
        </div>

        {/* Phone mockup */}
        <div style={{ marginTop:60,position:"relative",zIndex:1,animation:"lrevealAnim 1s .7s ease both" }}>
          <div style={{ width:240,height:490,borderRadius:42,background:"linear-gradient(145deg,#1a2840,#0d1925)",border:"1.5px solid rgba(255,255,255,.1)",boxShadow:"0 0 0 1px rgba(0,0,0,.5),0 40px 100px rgba(0,0,0,.6),0 0 60px rgba(29,179,126,.12),inset 0 1px 0 rgba(255,255,255,.08)",position:"relative",overflow:"hidden",margin:"0 auto",animation:"lfloat 6s ease-in-out infinite" }}>
            <div style={{ position:"absolute",inset:7,borderRadius:37,background:"linear-gradient(160deg,#0b1628,#0a1520)",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:85,height:24,background:"#080c14",borderRadius:"0 0 16px 16px",zIndex:10 }}/>
              <div style={{ padding:"34px 14px 14px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                  <span style={{ fontSize:13,fontWeight:800,color:"#25d494" }}>GymBro</span>
                  <div style={{ width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,#0e9965,#17c8a3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white" }}>A</div>
                </div>
                <div style={{ fontSize:10,color:"#4a6b60",marginBottom:3 }}>Good morning,</div>
                <div style={{ fontSize:15,fontWeight:800,color:"#f0f7f4",marginBottom:12 }}>Alex 🔥</div>
                <div style={{ display:"flex",gap:6,marginBottom:12 }}>
                  {[{v:"12",l:"Workouts"},{v:"3",l:"This Week"},{v:"5🔥",l:"Streak",c:"#ffaa44"}].map(s=>(
                    <div key={s.l} style={{ flex:1,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)",borderRadius:9,padding:"7px 4px",textAlign:"center" }}>
                      <div style={{ fontSize:14,fontWeight:800,color:s.c||"#25d494",lineHeight:1 }}>{s.v}</div>
                      <div style={{ fontSize:7,color:"#4a6b60",fontWeight:700,letterSpacing:.5,marginTop:3,textTransform:"uppercase" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"linear-gradient(135deg,rgba(29,179,126,.1),rgba(11,22,40,.8))",border:"1px solid rgba(29,179,126,.25)",borderRadius:12,padding:12 }}>
                  <div style={{ fontSize:7,color:"#1db37e",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:3 }}>Ready to Go ✓</div>
                  <div style={{ fontSize:13,fontWeight:800,color:"#f0f7f4",marginBottom:9 }}>Full Body Program</div>
                  <button style={{ background:"linear-gradient(135deg,#0e9965,#25d494)",border:"none",borderRadius:50,color:"white",fontSize:10,fontWeight:800,padding:"7px 0",width:"100%",cursor:"pointer" }}>Start Session →</button>
                </div>
              </div>
              <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"rgba(8,12,20,.95)",borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",padding:"7px 0 14px" }}>
                {["⚡","✦","🔥","📈"].map((t,i)=><div key={i} style={{ flex:1,textAlign:"center",fontSize:17,opacity:i===2?1:.4 }}>{t}</div>)}
              </div>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div style={{ position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:7,color:"#3a5a50",fontSize:10,fontWeight:600,letterSpacing:2,textTransform:"uppercase",zIndex:1,animation:"lrevealAnim 1s 1.2s ease both" }}>
          <div style={{ width:1,height:36,background:"linear-gradient(to bottom,#0e9965,transparent)",animation:"lscroll 2s ease-in-out infinite" }}/>
          Scroll
        </div>
      </section>

      {/* STATS */}
      <div style={{ background:"#0f1e35",borderTop:"1px solid rgba(255,255,255,.07)",borderBottom:"1px solid rgba(255,255,255,.07)",padding:"72px 5%" }}>
        <div className="l-stats-grid lreveal" style={{ maxWidth:860,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:40,textAlign:"center" }}>
          {[{n:"10K+",l:"Active athletes"},{n:"98%",l:"Satisfaction rate"},{n:"2M+",l:"Sets logged"},{n:"4.9★",l:"Average rating"}].map((s,i)=>(
            <div key={i} className={`lreveal ld${i}`}>
              <div style={{ fontSize:"clamp(40px,5vw,64px)",fontWeight:900,lineHeight:1,background:"linear-gradient(135deg,#25d494,#17c8a3)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8 }}>{s.n}</div>
              <div style={{ fontSize:13,color:"#7a9e94",fontWeight:500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="l-features" style={{ padding:"110px 5%",background:"#0b1628" }}>
        <div className="lreveal" style={{ textAlign:"center",maxWidth:640,margin:"0 auto 72px" }}>
          <span style={{ fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#1db37e",display:"block",marginBottom:14 }}>Everything you need</span>
          <h2 style={{ fontSize:"clamp(34px,5vw,56px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-1.5px",marginBottom:18 }}>Built different.<br/>For athletes who are serious.</h2>
          <p style={{ fontSize:"clamp(14px,1.8vw,17px)",color:"#7a9e94",lineHeight:1.75 }}>No fluff. No generic plans. GymBro uses AI to build, adapt, and guide your training around your life.</p>
        </div>

        <div className="l-bento-grid" style={{ display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:14,maxWidth:1060,margin:"0 auto" }}>
          {[
            {cls:"l-bento-1",col:"span 7",icon:"🤖",title:"AI Coach That Knows You",desc:"GymBro learns your name, goals, training environment, and experience level — then generates a fully personalised program with real-time form cues.",big:null,delay:""},
            {cls:"l-bento-2",col:"span 5",icon:null,title:"Infinite Workouts",desc:"Every session freshly generated. No two workouts the same.",big:"∞",delay:"ld1"},
            {cls:"l-bento-3",col:"span 4",icon:"🏠",title:"Home or Gym",desc:"Full programs for both. No equipment? GymBro adapts.",big:null,delay:""},
            {cls:"l-bento-4",col:"span 4",icon:"⏱️",title:"Live Rest Timers",desc:"Intelligent tracking that keeps you accountable between every set.",big:null,delay:"ld1"},
            {cls:"l-bento-5",col:"span 4",icon:"📈",title:"Progress Tracking",desc:"Sets logged, streaks maintained — your full history at a glance.",big:null,delay:"ld2"},
          ].map((card,i)=>(
            <div key={i} className={`l-bento-card lreveal ${card.delay}`} style={{ gridColumn:card.col }}>
              {card.big && <div style={{ fontSize:68,fontWeight:900,lineHeight:1,background:"linear-gradient(135deg,#25d494,#17c8a3)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8 }}>{card.big}</div>}
              {card.icon && <div style={{ width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,rgba(29,179,126,.15),rgba(23,200,163,.1))",border:"1px solid rgba(29,179,126,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:18 }}>{card.icon}</div>}
              <div style={{ fontSize:20,fontWeight:800,marginBottom:9,lineHeight:1.2 }}>{card.title}</div>
              <div style={{ fontSize:13,color:"#7a9e94",lineHeight:1.7 }}>{card.desc}</div>
              <div style={{ position:"absolute",right:-16,bottom:-16,fontSize:100,opacity:.04,pointerEvents:"none",lineHeight:1 }}>{card.icon||card.big}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="l-how" style={{ padding:"110px 5%",background:"#080c14" }}>
        <div className="lreveal" style={{ textAlign:"center",marginBottom:72 }}>
          <span style={{ fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#1db37e",display:"block",marginBottom:14 }}>Simple by design</span>
          <h2 style={{ fontSize:"clamp(34px,5vw,56px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-1.5px" }}>From zero to training<br/>in under 60 seconds.</h2>
        </div>
        <div className="l-how-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,borderRadius:22,overflow:"hidden",border:"1px solid rgba(255,255,255,.07)",maxWidth:1060,margin:"0 auto" }}>
          {[
            {n:"01",icon:"👤",title:"Set up your profile",desc:"Name, goals, experience, home or gym. 30 seconds."},
            {n:"02",icon:"⚡",title:"Generate your workout",desc:"AI builds a personalised session with warmup, main, and cooldown."},
            {n:"03",icon:"🔥",title:"Train with guidance",desc:"Real-time AI tips keep your form tight and intensity high."},
            {n:"04",icon:"📊",title:"Track your progress",desc:"Every session logged. Watch your results compound."},
          ].map((s,i)=>(
            <div key={i} className={`l-step lreveal ld${i}`} style={{ borderLeft:i>0?"1px solid rgba(255,255,255,.07)":"none" }}>
              <div style={{ fontSize:11,fontWeight:800,color:"#1db37e",letterSpacing:2,textTransform:"uppercase",marginBottom:18,display:"flex",alignItems:"center",gap:10 }}>
                {s.n}
                <div style={{ flex:1,height:1,background:"linear-gradient(to right,rgba(29,179,126,.3),transparent)" }}/>
              </div>
              <div style={{ fontSize:34,marginBottom:14 }}>{s.icon}</div>
              <div style={{ fontSize:18,fontWeight:800,marginBottom:9 }}>{s.title}</div>
              <div style={{ fontSize:13,color:"#7a9e94",lineHeight:1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="l-testimonials" style={{ padding:"110px 5%",background:"#080c14" }}>
        <div className="lreveal" style={{ textAlign:"center",marginBottom:60 }}>
          <span style={{ fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#1db37e",display:"block",marginBottom:14 }}>Real people. Real gains.</span>
          <h2 style={{ fontSize:"clamp(34px,5vw,56px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-1.5px" }}>They switched to GymBro.<br/>They didn't look back.</h2>
        </div>
        <div className="l-test-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,maxWidth:1060,margin:"0 auto" }}>
          {[
            {init:"M",name:"Marcus T.",meta:"Powerlifter · 2 years",text:"I've tried every fitness app out there. GymBro is the first one that actually feels like it knows me. The AI form cues are genuinely impressive."},
            {init:"S",name:"Sarah K.",meta:"Frequent traveler · 14-month streak",text:"The home workout mode is insane. I travel constantly and GymBro adapts every session to whatever space I'm in. No equipment? Doesn't matter."},
            {init:"J",name:"Jordan R.",meta:"Beginner turned intermediate",text:"I went from not knowing what progressive overload meant to running a proper 5-day split in 3 months. GymBro taught me how to train."},
          ].map((t,i)=>(
            <div key={i} className={`l-testimonial lreveal ld${i}`}>
              <div style={{ color:"#25d494",fontSize:13,marginBottom:14,letterSpacing:2 }}>★★★★★</div>
              <div style={{ fontSize:14,color:"#7a9e94",lineHeight:1.75,marginBottom:18,fontStyle:"italic" }}>"{t.text}"</div>
              <div style={{ display:"flex",alignItems:"center",gap:11 }}>
                <div style={{ width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#0e9965,#17c8a3)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"white",fontSize:14,flexShrink:0 }}>{t.init}</div>
                <div>
                  <div style={{ fontWeight:700,fontSize:13 }}>{t.name}</div>
                  <div style={{ fontSize:11,color:"#3a5a50",marginTop:2 }}>{t.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"130px 5%",textAlign:"center",background:"#0f1e35",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 60% at 50% 50%,rgba(29,179,126,.1) 0%,transparent 70%)",pointerEvents:"none" }}/>
        <h2 className="lreveal" style={{ fontSize:"clamp(40px,6vw,68px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-2px",marginBottom:18,position:"relative",zIndex:1 }}>Your best workout<br/>starts right now.</h2>
        <p className="lreveal ld1" style={{ fontSize:17,color:"#7a9e94",marginBottom:44,position:"relative",zIndex:1,maxWidth:400,margin:"0 auto 44px",lineHeight:1.65 }}>Join thousands of athletes already training smarter with GymBro. Free to start.</p>
        <div className="lreveal ld2" style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",position:"relative",zIndex:10 }}>
          <button className="l-btn-primary" onClick={(e)=>{ e.stopPropagation(); onEnter(); }}>Start Training Free →</button>
          <button className="l-btn-ghost" onClick={()=>document.getElementById("l-features")?.scrollIntoView({behavior:"smooth"})}>Learn More</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#080c14",borderTop:"1px solid rgba(255,255,255,.07)",padding:"48px 5% 36px" }}>
        <div style={{ maxWidth:1060,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20 }}>
          <div style={{ fontWeight:800,fontSize:17,color:"#25d494" }}>💪 GymBro</div>
          <div style={{ display:"flex",gap:24 }}>
            {["Privacy","Terms","Contact","GitHub"].map(l=>(
              <a key={l} href="javascript:void(0)" style={{ color:"#3a5a50",fontSize:12,textDecoration:"none",transition:"color .2s" }}
                onMouseEnter={e=>e.target.style.color="#7a9e94"}
                onMouseLeave={e=>e.target.style.color="#3a5a50"}>{l}</a>
            ))}
          </div>
          <div style={{ color:"#3a5a50",fontSize:11 }}>© 2025 GymBro. Built with 💚</div>
        </div>
      </footer>
    </div>
  );
}

/* ─── ROOT ─── */
export default function GymBro() {
  const [screen,  setScreen]  = useState("landing"); // landing | app
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

  if(screen === "landing") return (
    <LandingScreen onEnter={() => { console.log("onEnter called"); setScreen("app"); }} />
  );

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

      {/* ambient blobs */}
      <div style={{ position:"fixed",top:-100,left:-60,width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(29,179,126,.08) 0%,transparent 70%)",pointerEvents:"none",zIndex:0 }}/>
      <div style={{ position:"fixed",bottom:-80,right:-40,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(23,200,163,.06) 0%,transparent 70%)",pointerEvents:"none",zIndex:0 }}/>

      <div style={{ display:"flex", justifyContent:"center", background:"var(--navy)", minHeight:"100vh" }}>
        <div style={{ width:"100%", maxWidth:520, display:"flex", flexDirection:"column", position:"relative", zIndex:1 }}>
          <Header user={user} onEditProfile={()=>setShowProfile(true)}/>
          <div style={{ flex:1, paddingBottom:20 }}>
            <div key={tab} className="tabFade" style={{ minHeight:"100%" }}>
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