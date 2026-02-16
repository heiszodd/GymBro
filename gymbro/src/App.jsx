import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL STYLES ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:       #0b1628;
    --navy2:      #0f1e35;
    --navy3:      #162640;
    --green:      #1db37e;
    --green2:     #25d494;
    --green3:     #0e9965;
    --teal:       #17c8a3;
    --glow:       rgba(29,179,126,0.35);
    --glow2:      rgba(29,179,126,0.15);
    --glass:      rgba(255,255,255,0.04);
    --glass2:     rgba(255,255,255,0.07);
    --border:     rgba(255,255,255,0.07);
    --border2:    rgba(29,179,126,0.3);
    --text:       #e8f4f0;
    --text2:      #8baaa0;
    --text3:      #4a6b60;
    --radius:     20px;
    --radius-sm:  12px;
    --radius-pill: 50px;
    --font:       'Nunito', sans-serif;
    --font2:      'Outfit', sans-serif;
    --transition: 0.25s cubic-bezier(0.34,1.56,0.64,1);
    --transition-fast: 0.18s ease;
  }

  html, body { height: 100%; overflow: hidden; }
  body {
    background: var(--navy);
    color: var(--text);
    font-family: var(--font);
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--green3); border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 var(--glow); }
    50%      { box-shadow: 0 0 0 10px transparent; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes ripple {
    0%   { transform: scale(0); opacity: 0.5; }
    100% { transform: scale(4); opacity: 0; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes popIn {
    0%   { transform: scale(0.85); opacity: 0; }
    70%  { transform: scale(1.04); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-6px); }
  }

  .fadeUp  { animation: fadeUp  0.45s cubic-bezier(0.34,1.1,0.64,1) both; }
  .fadeIn  { animation: fadeIn  0.35s ease both; }
  .popIn   { animation: popIn   0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
  .slideIn { animation: slideIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both; }

  .hover-lift {
    transition: transform var(--transition), box-shadow var(--transition);
  }
  .hover-lift:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px var(--glow2);
  }

  .tab-btn {
    transition: color var(--transition-fast), background var(--transition-fast), transform var(--transition);
  }
  .tab-btn:active { transform: scale(0.85); }

  .card {
    background: var(--glass);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition);
  }
  .card:hover {
    border-color: var(--border2);
    box-shadow: 0 8px 32px var(--glow2);
  }

  .option-btn {
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    color: var(--text2);
    font-family: var(--font);
    font-weight: 600;
    font-size: 14px;
    padding: 13px 20px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .option-btn:hover {
    border-color: var(--green);
    color: var(--text);
    background: rgba(29,179,126,0.08);
    transform: translateX(4px);
  }
  .option-btn.selected {
    border-color: var(--green);
    background: rgba(29,179,126,0.12);
    color: var(--green2);
    box-shadow: 0 0 20px var(--glow2);
  }
  .option-btn:active { transform: scale(0.97); }

  .primary-btn {
    background: linear-gradient(135deg, var(--green3), var(--green), var(--teal));
    background-size: 200% 200%;
    background-position: 0% 50%;
    border: none;
    border-radius: var(--radius-pill);
    color: white;
    font-family: var(--font);
    font-weight: 800;
    font-size: 15px;
    letter-spacing: 0.5px;
    padding: 16px 0;
    width: 100%;
    cursor: pointer;
    transition: background-position 0.4s ease, box-shadow 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 24px var(--glow);
    position: relative;
    overflow: hidden;
  }
  .primary-btn:hover {
    background-position: 100% 50%;
    box-shadow: 0 8px 36px var(--glow);
    transform: translateY(-2px);
  }
  .primary-btn:active { transform: scale(0.97) translateY(0) !important; }

  .ripple-container { position: relative; overflow: hidden; }
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    animation: ripple 0.55s ease-out forwards;
    pointer-events: none;
  }

  .set-dot {
    transition: background 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
  }
  .set-dot.done {
    background: var(--green) !important;
    box-shadow: 0 0 10px var(--glow2);
    transform: scale(1.2);
  }
  .set-dot.current {
    background: rgba(29,179,126,0.45) !important;
    animation: pulse 1.6s infinite;
  }
`;

/* ─── DATA ─── */
const GOALS     = ["Build Muscle","Lose Fat","Increase Strength","Improve Endurance","General Fitness"];
const LEVELS    = ["Beginner","Intermediate","Advanced"];
const DURATIONS = ["30 min","45 min","60 min","75 min","90 min"];
const FOCUS     = ["Full Body","Upper Body","Lower Body","Push Day","Pull Day","Legs","Core","Cardio"];

const BASE_WORKOUT = {
  warmup: [
    { name:"Jump Rope",        sets:1, reps:"3 min",       rest:30,  notes:"Light pace, wrists relaxed",      icon:"🪢" },
    { name:"Arm Circles",      sets:2, reps:"20 each way",  rest:15,  notes:"Full range, shoulders loose",     icon:"🔄" },
    { name:"Hip Circles",      sets:2, reps:"20 each way",  rest:15,  notes:"Core braced, smooth motion",      icon:"🌀" },
  ],
  main: [
    { name:"Barbell Squat",    sets:4, reps:"8–10",  rest:90, muscle:"Quads · Glutes · Core",   notes:"Drive knees out, chest tall",         icon:"🏋️" },
    { name:"Bench Press",      sets:4, reps:"8–10",  rest:90, muscle:"Chest · Triceps · Delts", notes:"Grip just outside shoulder width",    icon:"💪" },
    { name:"Bent-Over Row",    sets:4, reps:"8–10",  rest:90, muscle:"Back · Biceps",            notes:"Flat back, pull to belly button",     icon:"🔙" },
    { name:"Overhead Press",   sets:3, reps:"10–12", rest:75, muscle:"Shoulders · Triceps",      notes:"Brace core, don't flare elbows",      icon:"☝️" },
    { name:"Romanian Deadlift",sets:3, reps:"10–12", rest:75, muscle:"Hamstrings · Glutes",      notes:"Hinge at hips, soft knee bend",       icon:"⬇️" },
    { name:"Cable Row",        sets:3, reps:"12–15", rest:60, muscle:"Back · Biceps",            notes:"Full stretch on each rep",            icon:"🔛" },
  ],
  cooldown: [
    { name:"Quad Stretch",   sets:1, reps:"45s each", rest:0, notes:"Hold wall, sink into it",  icon:"🦵" },
    { name:"Hip Flexor",     sets:1, reps:"45s each", rest:0, notes:"Lunge, hips forward",      icon:"🧘" },
    { name:"Child's Pose",   sets:1, reps:"60 sec",   rest:0, notes:"Breathe deep, release",    icon:"🛐" },
  ],
};

function buildWorkout(goal, level, duration, focus) {
  const mult = level === "Beginner" ? 0.75 : level === "Advanced" ? 1.25 : 1;
  const mod  = arr => arr.map(e => ({ ...e, sets: Math.round(e.sets * mult) }));
  return {
    goal, level, duration, focus,
    warmup:   mod(BASE_WORKOUT.warmup),
    main:     mod(BASE_WORKOUT.main),
    cooldown: mod(BASE_WORKOUT.cooldown),
    estimatedCalories: parseInt(duration) * 7,
  };
}

/* ─── RIPPLE HOOK ─── */
function useRipple() {
  return (e, ref) => {
    if (!ref.current) return;
    const btn  = ref.current;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x    = e.clientX - rect.left - size / 2;
    const y    = e.clientY - rect.top  - size / 2;
    const el   = document.createElement("span");
    el.className = "ripple-effect";
    el.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  };
}

/* ─── COMPONENTS ─── */
function GlassCard({ children, style, className = "", onClick, delay = 0 }) {
  const ref = useRef();
  const ripple = useRipple();
  return (
    <div
      ref={ref}
      className={`card fadeUp ripple-container ${className}`}
      style={{ animationDelay: `${delay}ms`, ...style }}
      onClick={e => { if (onClick) { ripple(e, ref); onClick(e); } }}
    >
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, style, disabled }) {
  const ref = useRef();
  const ripple = useRipple();
  return (
    <button
      ref={ref}
      className="primary-btn ripple-container"
      style={style}
      disabled={disabled}
      onClick={e => { ripple(e, ref); onClick && onClick(e); }}
    >
      {children}
    </button>
  );
}

function StatBadge({ label, value, unit = "", color = "var(--green)", delay = 0 }) {
  return (
    <GlassCard delay={delay} style={{ flex: 1, padding: "14px 10px", textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font2)", fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>
        {value}<span style={{ fontSize: 13, marginLeft: 2 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 10, color: "var(--text3)", letterSpacing: 1.5, marginTop: 5, fontWeight: 700, fontFamily: "var(--font2)", textTransform: "uppercase" }}>
        {label}
      </div>
    </GlassCard>
  );
}

/* ─── HEADER ─── */
function Header() {
  return (
    <div style={{ padding: "24px 22px 0", background: "linear-gradient(180deg, var(--navy) 60%, transparent)", position: "sticky", top: 0, zIndex: 20 }}>
      <div className="fadeUp" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: "linear-gradient(135deg, var(--green3), var(--teal))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 4px 16px var(--glow)",
          animation: "float 3s ease-in-out infinite",
        }}>💪</div>
        <div style={{
          fontFamily: "var(--font2)", fontWeight: 800, fontSize: 26,
          background: "linear-gradient(135deg, var(--green2), var(--teal))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px",
        }}>GymBro</div>
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg, var(--green3), transparent)", marginTop: 10, opacity: 0.5 }} />
    </div>
  );
}

/* ─── TAB BAR ─── */
function TabBar({ active, onChange }) {
  const tabs = [
    { id: "home",    icon: "⚡", label: "Home"  },
    { id: "create",  icon: "✦",  label: "Build" },
    { id: "workout", icon: "🔥", label: "Train" },
    { id: "history", icon: "📈", label: "Stats" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 480,
      background: "rgba(11,22,40,0.92)", backdropFilter: "blur(24px)",
      borderTop: "1px solid var(--border)",
      display: "flex", zIndex: 100, padding: "6px 8px 14px",
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} className="tab-btn" onClick={() => onChange(t.id)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 4px",
            color: isActive ? "var(--green)" : "var(--text3)",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 14,
              background: isActive ? "rgba(29,179,126,0.15)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              transition: "background 0.25s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s",
              transform: isActive ? "scale(1.12)" : "scale(1)",
              boxShadow: isActive ? "0 0 16px var(--glow2)" : "none",
            }}>{t.icon}</div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, fontFamily: "var(--font2)", opacity: isActive ? 1 : 0.5, transition: "opacity 0.2s" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── HOME ─── */
const TIPS = [
  "Progressive overload is the real secret. Add just a little more each session.",
  "Sleep 7–9 hours — that's when your muscles actually repair and grow.",
  "Aim for 0.8–1g of protein per lb of bodyweight every single day.",
  "Rest 60–90s for hypertrophy, 3–5 min for max strength. Don't skip it.",
  "Deload every 4–6 weeks. Recovery is training too.",
];

function HomeScreen({ onStart, savedWorkout, stats }) {
  const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length];
  const h   = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "20px 20px 0" }}>
      <div className="fadeUp" style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, color: "var(--text3)", fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <div style={{ fontFamily: "var(--font2)", fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
          {greeting},<br />
          <span style={{ background: "linear-gradient(135deg,var(--green2),var(--teal))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            let's get to work 🔥
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <StatBadge label="Workouts"  value={stats.total}  delay={50}  />
        <StatBadge label="This Week" value={stats.week}   delay={100} color="var(--teal)"  />
        <StatBadge label="Streak"    value={stats.streak} unit="🔥"   delay={150} color="#ffaa44" />
      </div>

      {savedWorkout ? (
        <GlassCard delay={200} style={{
          padding: 20, marginBottom: 18,
          border: "1px solid var(--border2)",
          background: "linear-gradient(135deg, rgba(29,179,126,0.08), rgba(11,22,40,0.6))",
          boxShadow: "0 8px 32px var(--glow2)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, letterSpacing: 1.5, marginBottom: 6, textTransform: "uppercase" }}>Ready to Go ✓</div>
              <div style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 20 }}>{savedWorkout.focus}</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(29,179,126,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏋️</div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {[savedWorkout.goal, savedWorkout.level, savedWorkout.duration].map(tag => (
              <span key={tag} style={{ background: "rgba(29,179,126,0.1)", border: "1px solid var(--border2)", padding: "4px 12px", borderRadius: 20, fontSize: 11, color: "var(--green2)", fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
          <PrimaryBtn onClick={onStart}>Start Session →</PrimaryBtn>
        </GlassCard>
      ) : (
        <GlassCard delay={200} style={{ padding: 28, marginBottom: 18, textAlign: "center", border: "1px dashed var(--border)" }}>
          <div style={{ fontSize: 40, marginBottom: 10, animation: "float 3s ease-in-out infinite" }}>🏗️</div>
          <div style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No Workout Built Yet</div>
          <div style={{ fontSize: 13, color: "var(--text3)" }}>Head to Build tab to generate your plan</div>
        </GlassCard>
      )}

      <GlassCard delay={280} style={{ padding: 18 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, background: "rgba(29,179,126,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💡</div>
          <div>
            <div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, letterSpacing: 1.5, marginBottom: 5, textTransform: "uppercase" }}>Coach Tip</div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65, fontStyle: "italic" }}>"{tip}"</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

/* ─── BUILD ─── */
function BuildScreen({ onWorkoutCreated }) {
  const [step, setStep]         = useState(0);
  const [goal, setGoal]         = useState(null);
  const [level, setLevel]       = useState(null);
  const [duration, setDuration] = useState(null);
  const [focus, setFocus]       = useState(null);
  const [generating, setGen]    = useState(false);
  const [aiMsg, setAiMsg]       = useState("");
  const [workout, setWorkout]   = useState(null);
  const [key, setKey]           = useState(0);

  const next = () => setTimeout(() => { setStep(s => Math.min(s + 1, 3)); setKey(k => k + 1); }, 220);

  const steps = [
    { title: "What's your goal?",       sub: "Choose what you're training for",          options: GOALS,     val: goal,     set: v => { setGoal(v);     next(); } },
    { title: "Your experience level",   sub: "Be honest — it shapes your program",       options: LEVELS,    val: level,    set: v => { setLevel(v);    next(); } },
    { title: "How long do you have?",   sub: "We'll fit a great session in any window",  options: DURATIONS, val: duration, set: v => { setDuration(v); next(); } },
    { title: "Focus area",              sub: "What muscles are we hitting today?",       options: FOCUS,     val: focus,    set: v => setFocus(v) },
  ];

  const generate = async () => {
    setGen(true); setAiMsg("");
    const prompt = `You are GymBro, an elite AI coach. User: Goal=${goal}, Level=${level}, Duration=${duration}, Focus=${focus}. Write a punchy 2-sentence motivational intro for their session. Be direct and energetic. Max 50 words.`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
},
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const d = await r.json();
      setAiMsg(d.content?.map(b => b.text || "").join("") || "");
    } catch { setAiMsg(`Let's get to work. Your ${focus} session is built and ready.`); }
    setTimeout(() => { setWorkout(buildWorkout(goal, level, duration, focus)); setGen(false); }, 1200);
  };

  if (generating) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 420 }}>
      <div style={{
        width: 72, height: 72, borderRadius: 24,
        background: "linear-gradient(135deg, var(--green3), var(--teal))",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32, marginBottom: 20,
        animation: "spin 1.2s linear infinite",
        boxShadow: "0 0 32px var(--glow)",
      }}>⚡</div>
      <div style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Building Your Plan</div>
      <div style={{ color: "var(--text3)", fontSize: 13 }}>GymBro AI is dialing it in…</div>
    </div>
  );

  if (workout) return (
    <div style={{ padding: "20px 20px 0" }}>
      {aiMsg && (
        <GlassCard delay={0} style={{ padding: 16, marginBottom: 18, border: "1px solid rgba(29,179,126,0.3)", background: "rgba(29,179,126,0.06)" }}>
          <div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, letterSpacing: 1.5, marginBottom: 6, textTransform: "uppercase" }}>🤖 GymBro AI</div>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65, fontStyle: "italic" }}>{aiMsg}</div>
        </GlassCard>
      )}
      <div className="fadeUp" style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>{workout.focus} Program</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[workout.goal, workout.level, workout.duration].map(t => (
            <span key={t} style={{ background: "rgba(29,179,126,0.1)", border: "1px solid var(--border2)", padding: "4px 12px", borderRadius: 20, fontSize: 11, color: "var(--green2)", fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>

      {["warmup","main","cooldown"].map((ph, pi) => (
        <div key={ph} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 11, letterSpacing: 1.5, color: ph === "main" ? "var(--green)" : "var(--text3)", textTransform: "uppercase" }}>
              {ph === "warmup" ? "🔥 Warm Up" : ph === "main" ? "⚡ Main Workout" : "❄️ Cool Down"}
            </div>
            <div style={{ flex: 1, height: 1, background: ph === "main" ? "var(--border2)" : "var(--border)" }} />
          </div>
          {workout[ph].map((ex, i) => (
            <GlassCard key={i} delay={i * 55 + pi * 70} className="card hover-lift" style={{ padding: "13px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(29,179,126,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{ex.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{ex.name}</div>
                  {ex.muscle && <div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, letterSpacing: 0.5, marginTop: 2 }}>{ex.muscle}</div>}
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{ex.notes}</div>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 16, color: "var(--green2)" }}>{ex.sets}×{ex.reps}</div>
                {ex.rest > 0 && <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{ex.rest}s rest</div>}
              </div>
            </GlassCard>
          ))}
        </div>
      ))}

      <PrimaryBtn onClick={() => onWorkoutCreated(workout)} style={{ marginBottom: 12 }}>Save This Workout ✓</PrimaryBtn>
      <button onClick={() => setWorkout(null)} style={{ width: "100%", background: "none", border: "none", color: "var(--text3)", fontSize: 13, cursor: "pointer", padding: "10px 0" }}>← Rebuild</button>
    </div>
  );

  const cur = steps[step];
  return (
    <div style={{ padding: "20px 20px 0" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: i < step ? "var(--green)" : i === step ? "var(--green2)" : "var(--border)",
            transition: "background 0.4s ease",
            boxShadow: i <= step ? "0 0 8px var(--glow2)" : "none",
          }} />
        ))}
      </div>

      <div key={key} className="slideIn" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, letterSpacing: 1.5, marginBottom: 6, textTransform: "uppercase" }}>Step {step + 1} of {steps.length}</div>
        <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 24, marginBottom: 4 }}>{cur.title}</div>
        <div style={{ fontSize: 13, color: "var(--text3)" }}>{cur.sub}</div>
      </div>

      <div key={`o-${key}`} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {cur.options.map((opt, i) => (
          <button key={opt} className={`option-btn fadeUp ${cur.val === opt ? "selected" : ""}`} style={{ animationDelay: `${i * 55}ms` }} onClick={() => cur.set(opt)}>
            <span>{opt}</span>
            {cur.val === opt && <span>✓</span>}
          </button>
        ))}
      </div>

      {step === 3 && focus && <PrimaryBtn onClick={generate}>Generate My Workout ⚡</PrimaryBtn>}
      {step > 0 && (
        <button onClick={() => { setStep(s => s - 1); setKey(k => k + 1); }} style={{ width: "100%", background: "none", border: "none", color: "var(--text3)", fontSize: 13, cursor: "pointer", padding: "12px 0", marginTop: 6 }}>← Back</button>
      )}
    </div>
  );
}

/* ─── REST TIMER ─── */
function RestTimer({ seconds, onDone }) {
  const [rem, setRem] = useState(seconds);
  useEffect(() => {
    if (rem <= 0) { onDone(); return; }
    const t = setTimeout(() => setRem(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [rem]);

  const R = 54, circ = 2 * Math.PI * R;

  return (
    <div className="fadeIn" style={{ position: "fixed", inset: 0, background: "rgba(11,22,40,0.95)", backdropFilter: "blur(16px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
      <GlassCard style={{ padding: "40px 48px", textAlign: "center", border: "1px solid var(--border2)", boxShadow: "0 0 60px var(--glow2)" }}>
        <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 700, letterSpacing: 2, marginBottom: 20, textTransform: "uppercase" }}>Rest Period</div>
        <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto 20px" }}>
          <svg width={130} height={130} style={{ position: "absolute", top: 0, left: 0 }}>
            <circle cx={65} cy={65} r={R} fill="none" stroke="var(--border)" strokeWidth={6} />
            <circle cx={65} cy={65} r={R} fill="none" stroke="var(--green)" strokeWidth={6}
              strokeDasharray={circ} strokeDashoffset={circ * (1 - rem / seconds)}
              strokeLinecap="round" transform="rotate(-90 65 65)"
              style={{ transition: "stroke-dashoffset 1s linear", filter: "drop-shadow(0 0 8px var(--green))" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 36, lineHeight: 1 }}>{rem}</div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, letterSpacing: 1 }}>sec</div>
          </div>
        </div>
        <button onClick={onDone} style={{
          background: "rgba(29,179,126,0.12)", border: "1px solid var(--border2)",
          color: "var(--green)", padding: "10px 28px", borderRadius: 50,
          cursor: "pointer", fontFamily: "var(--font)", fontWeight: 700, fontSize: 13,
          transition: "background 0.2s, transform 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(29,179,126,0.22)"; e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(29,179,126,0.12)"; e.currentTarget.style.transform = "scale(1)"; }}
        >Skip Rest</button>
      </GlassCard>
    </div>
  );
}

/* ─── WORKOUT ─── */
function WorkoutScreen({ workout, onComplete }) {
  const PHASES = ["warmup","main","cooldown"];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [exIdx,    setExIdx]    = useState(0);
  const [setIdx,   setSetIdx]   = useState(0);
  const [resting,  setResting]  = useState(false);
  const [log,      setLog]      = useState({});
  const [done,     setDone]     = useState(false);
  const [aiTip,    setAiTip]    = useState("");
  const [tipLoad,  setTipLoad]  = useState(false);
  const [cardKey,  setCardKey]  = useState(0);

  if (!workout) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>💪</div>
      <div style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>No Workout Loaded</div>
      <div style={{ color: "var(--text3)", fontSize: 13 }}>Go to Build tab to create your workout first</div>
    </div>
  );

  const phase = PHASES[phaseIdx];
  const exercises = workout[phase];
  const ex = exercises[exIdx];
  const totalSets = PHASES.reduce((a, p) => a + workout[p].reduce((b, e) => b + e.sets, 0), 0);
  const doneSets  = Object.values(log).reduce((a, v) => a + v, 0);
  const progress  = doneSets / totalSets;
  const logKey    = `${phase}-${exIdx}`;

  const fetchTip = async () => {
    setAiTip(""); setTipLoad(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `GymBro AI coach: Give ONE ultra-short (max 15 words) form cue or motivational tip for: ${ex.name}. Be bold and specific.` }] }),
      });
      const d = await r.json();
      setAiTip(d.content?.map(b => b.text || "").join("") || ex.notes);
    } catch { setAiTip(ex.notes); }
    setTipLoad(false);
  };

  useEffect(() => { fetchTip(); setCardKey(k => k + 1); }, [exIdx, phaseIdx]);

  const advance = () => {
    if (exIdx + 1 < exercises.length) { setExIdx(i => i + 1); setSetIdx(0); }
    else if (phaseIdx + 1 < PHASES.length) { setPhaseIdx(p => p + 1); setExIdx(0); setSetIdx(0); }
    else { setDone(true); onComplete && onComplete({ workout, log, completedAt: new Date() }); }
  };

  const afterRest = () => {
    setResting(false);
    if (setIdx + 1 < ex.sets) setSetIdx(s => s + 1);
    else advance();
  };

  const handleSetDone = () => {
    const nl = { ...log, [logKey]: (log[logKey] || 0) + 1 };
    setLog(nl);
    if (setIdx + 1 < ex.sets) { if (ex.rest > 0) setResting(true); else setSetIdx(s => s + 1); }
    else { if (ex.rest > 0) setResting(true); else advance(); }
  };

  if (done) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 420, padding: "40px 20px 0" }}>
      <div className="popIn" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🏆</div>
        <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 30, marginBottom: 6, background: "linear-gradient(135deg,var(--green2),var(--teal))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Session Complete!</div>
        <div style={{ color: "var(--text3)", fontSize: 14, marginBottom: 28 }}>You crushed it. Rest, eat, grow. 💪</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <GlassCard style={{ padding: "16px 22px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 26, color: "var(--green)" }}>{doneSets}</div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>Sets Done</div>
          </GlassCard>
          <GlassCard style={{ padding: "16px 22px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 26, color: "var(--teal)" }}>{workout.estimatedCalories}</div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>Est. Cals</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "20px 20px 0" }}>
      {resting && <RestTimer seconds={ex.rest} onDone={afterRest} />}

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
          <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{phase} · {exIdx + 1}/{exercises.length}</div>
          <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 800 }}>{Math.round(progress * 100)}%</div>
        </div>
        <div style={{ height: 6, background: "var(--glass2)", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, background: "linear-gradient(90deg, var(--green3), var(--green2))", borderRadius: 6, boxShadow: "0 0 10px var(--glow)", transition: "width 0.6s cubic-bezier(0.34,1.2,0.64,1)" }} />
        </div>
      </div>

      <GlassCard key={cardKey} delay={0} style={{
        padding: 24, marginBottom: 16,
        border: "1px solid var(--border2)",
        background: "linear-gradient(135deg, rgba(29,179,126,0.06), rgba(11,22,40,0.4))",
        boxShadow: "0 8px 40px var(--glow2)",
      }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: 18, background: "rgba(29,179,126,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, boxShadow: "0 4px 16px var(--glow2)" }}>{ex.icon}</div>
          <div>
            {ex.muscle && <div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, letterSpacing: 1.5, marginBottom: 4, textTransform: "uppercase" }}>{ex.muscle}</div>}
            <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 22, lineHeight: 1.1 }}>{ex.name}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[{ l: "Reps", v: ex.reps }, { l: "Set", v: `${setIdx+1}/${ex.sets}` }, ...(ex.rest > 0 ? [{ l: "Rest", v: `${ex.rest}s` }] : [])].map((item, i) => (
            <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 20, color: "var(--green2)", lineHeight: 1 }}>{item.v}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>{item.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          {Array.from({ length: ex.sets }).map((_, i) => (
            <div key={i} className={`set-dot ${i < setIdx ? "done" : i === setIdx ? "current" : ""}`} style={{
              flex: 1, height: 8, borderRadius: 4,
              background: i < setIdx ? "var(--green)" : i === setIdx ? "rgba(29,179,126,0.4)" : "var(--border)",
            }} />
          ))}
        </div>

        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 14, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 14 }}>🤖</span>
          <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, fontStyle: "italic" }}>
            {tipLoad ? <span style={{ color: "var(--text3)" }}>Loading tip…</span> : (aiTip || ex.notes)}
          </span>
        </div>
      </GlassCard>

      <PrimaryBtn onClick={handleSetDone}>Set Complete ✓</PrimaryBtn>

      {(exIdx > 0 || phaseIdx > 0) && (
        <button onClick={() => {
          if (exIdx > 0) { setExIdx(i => i - 1); setSetIdx(0); }
          else if (phaseIdx > 0) { setPhaseIdx(p => p - 1); setExIdx(workout[PHASES[phaseIdx - 1]].length - 1); setSetIdx(0); }
        }} style={{ width: "100%", background: "none", border: "none", color: "var(--text3)", fontSize: 12, cursor: "pointer", padding: "12px 0", marginTop: 4 }}>
          ← Previous exercise
        </button>
      )}
    </div>
  );
}

/* ─── HISTORY ─── */
function HistoryScreen({ history }) {
  if (!history.length) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>📈</div>
      <div style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>No Data Yet</div>
      <div style={{ color: "var(--text3)", fontSize: 13 }}>Complete a workout to see your stats here</div>
    </div>
  );

  const total = history.length;
  const week  = history.filter(h => (new Date() - new Date(h.completedAt)) < 7 * 86400000).length;
  const sets  = history.reduce((a, h) => a + Object.values(h.log || {}).reduce((b, v) => b + v, 0), 0);

  return (
    <div style={{ padding: "20px 20px 0" }}>
      <div className="fadeUp" style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 24, marginBottom: 18 }}>Your Stats</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <StatBadge label="Total"     value={total} delay={0}   />
        <StatBadge label="This Week" value={week}  delay={60}  color="var(--teal)"  />
        <StatBadge label="Sets Done" value={sets}  delay={120} color="#ffaa44" />
      </div>
      <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, letterSpacing: 1.5, marginBottom: 12, textTransform: "uppercase" }}>Recent Sessions</div>
      {[...history].reverse().slice(0, 10).map((h, i) => (
        <GlassCard key={i} delay={i * 60} className="card hover-lift" style={{ padding: "14px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: "rgba(29,179,126,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏋️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{h.workout?.focus}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                {new Date(h.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {h.workout?.duration}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 16, color: "var(--green)" }}>{Object.values(h.log || {}).reduce((a, v) => a + v, 0)} sets</div>
            <div style={{ fontSize: 10, color: "var(--green3)", fontWeight: 700, marginTop: 2 }}>✓ Done</div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

/* ─── ROOT ─── */
export default function GymBro() {
  const [tab,     setTab]     = useState("home");
  const [saved,   setSaved]   = useState(null);
  const [history, setHistory] = useState([]);
  const [stats,   setStats]   = useState({ total: 0, week: 0, streak: 0 });

  const handleCreated = (w) => { setSaved(w); setTab("home"); };
  const handleDone    = (r) => {
    const nh = [...history, r];
    setHistory(nh);
    const week = nh.filter(h => (new Date() - new Date(h.completedAt)) < 7 * 86400000).length;
    setStats({ total: nh.length, week, streak: Math.min(nh.length, 7) });
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {/* ambient glow blobs */}
      <div style={{ position: "fixed", top: -120, left: -80,  width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,179,126,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, right: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(23,200,163,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <Header />
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 90 }}>
          {tab === "home"    && <HomeScreen    onStart={() => setTab("workout")} savedWorkout={saved} stats={stats} />}
          {tab === "create"  && <BuildScreen   onWorkoutCreated={handleCreated} />}
          {tab === "workout" && <WorkoutScreen workout={saved} onComplete={handleDone} />}
          {tab === "history" && <HistoryScreen history={history} />}
        </div>
        <TabBar active={tab} onChange={setTab} />
      </div>
    </>
  );
}