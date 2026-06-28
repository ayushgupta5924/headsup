import { useState, useEffect, useRef, useCallback } from "react";
import CATEGORIES, { HARDCODED_WORDS } from "./words.js";

// ── Fixed team config ─────────────────────────────────────────────────────────
const TEAMS      = { A: "Surendra", B: "Sangeeta" };
const TEAM_COLOR = { A: "#FF6B6B",  B: "#4ECDC4"  };

const WORDS_PER_ROUND = 20;
const TIMER_SECONDS   = 60;
const SCREEN = {
  LOBBY: "lobby", CATEGORY: "category",
  PLAYING: "playing", RESULTS: "results", SCOREBOARD: "scoreboard",
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [screen, setScreen]             = useState(SCREEN.LOBBY);
  const [activeTeam, setActiveTeam]     = useState("A");
  const [category, setCategory]         = useState(null);
  const [words, setWords]               = useState([]);
  const [wordIndex, setWordIndex]       = useState(0);
  const [roundResults, setRoundResults] = useState([]);
  const [timeLeft, setTimeLeft]         = useState(TIMER_SECONDS);
  const [scores, setScores]             = useState({ A: 0, B: 0 });
  const timerRef = useRef(null);

  function buildWordPool(catId) {
    const hardcoded = [...(HARDCODED_WORDS[catId] || [])];
    return shuffle(hardcoded).slice(0, WORDS_PER_ROUND);
  }

  function startRound(cat) {
    setCategory(cat);
    setWords(buildWordPool(cat.id));
    setWordIndex(0);
    setRoundResults([]);
    setTimeLeft(TIMER_SECONDS);
    setScreen(SCREEN.PLAYING);
  }

  useEffect(() => {
    if (screen !== SCREEN.PLAYING) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setScreen(SCREEN.RESULTS); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const answer = useCallback((correct) => {
    const updated = [...roundResults, { word: words[wordIndex], correct }];
    setRoundResults(updated);
    if (wordIndex + 1 >= words.length) {
      clearInterval(timerRef.current);
      setRoundResults(updated);
      setScreen(SCREEN.RESULTS);
    } else {
      setWordIndex(i => i + 1);
    }
  }, [roundResults, words, wordIndex]);

  function finishRound(results) {
    const correct = results.filter(r => r.correct).length;
    setScores(s => ({ ...s, [activeTeam]: s[activeTeam] + correct }));
    setScreen(SCREEN.SCOREBOARD);
  }

  function chooseTeam(team) {
    setActiveTeam(team);
    setScreen(SCREEN.CATEGORY);
  }

  if (screen === SCREEN.LOBBY)
    return <LobbyScreen scores={scores} activeTeam={activeTeam} onStart={() => setScreen(SCREEN.CATEGORY)} />;
  if (screen === SCREEN.CATEGORY)
    return <CategoryScreen activeTeam={activeTeam} onPick={startRound} />;
  if (screen === SCREEN.PLAYING)
    return <PlayScreen word={words[wordIndex]} index={wordIndex} total={words.length} timeLeft={timeLeft} timerPct={timeLeft / TIMER_SECONDS} category={category} onCorrect={() => answer(true)} onPass={() => answer(false)} activeTeam={activeTeam} />;
  if (screen === SCREEN.RESULTS)
    return <ResultsScreen results={roundResults} category={category} activeTeam={activeTeam} onDone={() => finishRound(roundResults)} />;
  if (screen === SCREEN.SCOREBOARD)
    return <ScoreboardScreen scores={scores} activeTeam={activeTeam} onChooseTeam={chooseTeam} onHome={() => setScreen(SCREEN.LOBBY)} />;
  return null;
}

// ── Lobby ──────────────────────────────────────────────────────────────────────
function LobbyScreen({ scores, activeTeam, onStart }) {
  return (
    <div style={S.page}>
      <div style={S.logoMark}>🎉</div>
      <h2 style={S.sectionTitle}>Party Lobby</h2>
      <div style={{ display: "flex", gap: 14, marginBottom: 24, width: "100%", maxWidth: 400 }}>
        {["A","B"].map(t => (
          <div key={t} style={{ flex: 1, background: "#1a1a2a", borderRadius: 18, padding: "18px 14px", textAlign: "center", border: `2px solid ${activeTeam === t ? TEAM_COLOR[t] : "#ffffff11"}` }}>
            {activeTeam === t && <div style={{ fontSize: 10, fontWeight: 700, color: TEAM_COLOR[t], letterSpacing: 1, marginBottom: 6 }}>PLAYING FIRST</div>}
            <div style={{ fontSize: 20, fontWeight: 800, color: TEAM_COLOR[t] }}>{TEAMS[t]}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginTop: 10 }}>{scores[t]}</div>
            <div style={{ fontSize: 11, color: "#555" }}>points</div>
          </div>
        ))}
      </div>
      <button style={{ ...S.bigBtn, background: `linear-gradient(135deg, ${TEAM_COLOR[activeTeam]}, #A29BFE)` }} onClick={onStart}>
        {TEAMS[activeTeam]}'s Turn →
      </button>
    </div>
  );
}

// ── Category ───────────────────────────────────────────────────────────────────
function CategoryScreen({ activeTeam, onPick }) {
  return (
    <div style={S.page}>
      <div style={{ width: 54, height: 54, borderRadius: "50%", background: `${TEAM_COLOR[activeTeam]}22`, border: `2px solid ${TEAM_COLOR[activeTeam]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: TEAM_COLOR[activeTeam], marginBottom: 12 }}>
        {TEAMS[activeTeam][0]}
      </div>
      <h2 style={S.sectionTitle}>{TEAMS[activeTeam]}</h2>
      <p style={S.muted}>Pick a category</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", maxWidth: 420 }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => onPick(cat)} style={{ background: cat.color, border: "none", borderRadius: 18, padding: "22px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#fff" }}>
            <span style={{ fontSize: 30 }}>{cat.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Play ───────────────────────────────────────────────────────────────────────
function PlayScreen({ word, index, total, timeLeft, timerPct, category, onCorrect, onPass }) {
  const timerColor = timeLeft > 10 ? "#00B894" : timeLeft > 5 ? "#F7B731" : "#FF6B6B";
  return (
    <div style={{ background: category.color, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 24px 40px" }}>
      <div style={{ width: "100%", maxWidth: 420, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.85)", background: "rgba(0,0,0,0.2)", borderRadius: 20, padding: "4px 12px" }}>{index + 1} / {total}</div>
        <svg width="62" height="62">
          <circle cx="31" cy="31" r="26" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="5" />
          <circle cx="31" cy="31" r="26" fill="none" stroke={timerColor} strokeWidth="5"
            strokeDasharray={`${163.4 * timerPct} 163.4`} strokeLinecap="round"
            transform="rotate(-90 31 31)" style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s" }} />
          <text x="31" y="36" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="700">{timeLeft}</text>
        </svg>
        <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)", background: "rgba(0,0,0,0.2)", borderRadius: 20, padding: "4px 10px" }}>{category.emoji} {category.name}</div>
      </div>
      <div style={{ width: "100%", maxWidth: 420, height: 5, borderRadius: 5, background: "rgba(255,255,255,0.2)", marginBottom: 28, overflow: "hidden" }}>
        <div style={{ height: "100%", background: "rgba(255,255,255,0.9)", borderRadius: 5, width: `${(index / total) * 100}%`, transition: "width 0.3s" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.15)", borderRadius: 28, width: "100%", maxWidth: 420, minHeight: 200, padding: "32px 28px", marginBottom: 28, flex: 1 }}>
        <p style={{ fontSize: 90, fontWeight: 800, textAlign: "center", color: "#fff", margin: 0, lineHeight: 1.2 }}>{word}</p>
      </div>
      <div style={{ display: "flex", gap: 14, width: "100%", maxWidth: 420 }}>
        <button onClick={onPass} style={{ flex: 1, background: "rgba(0,0,0,0.25)", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 18, padding: "18px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#fff" }}>
          <span style={{ fontSize: 22, fontWeight: 800 }}>✗</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Pass</span>
        </button>
        <button onClick={onCorrect} style={{ flex: 1, background: "rgba(255,255,255,0.92)", border: "none", borderRadius: 18, padding: "18px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#1a1a2e" }}>
          <span style={{ fontSize: 22, fontWeight: 800 }}>✓</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Got it!</span>
        </button>
      </div>
    </div>
  );
}

// ── Results ────────────────────────────────────────────────────────────────────
function ResultsScreen({ results, category, activeTeam, onDone }) {
  const correct = results.filter(r => r.correct).length;
  const color = TEAM_COLOR[activeTeam];
  return (
    <div style={S.page}>
      <div style={{ width: 110, height: 110, borderRadius: "50%", border: `5px solid ${color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 40, fontWeight: 800, color, lineHeight: 1 }}>{correct}</span>
        <span style={{ fontSize: 15, color: "#666" }}>/ {results.length}</span>
      </div>
      <h2 style={S.sectionTitle}>{TEAMS[activeTeam]} got {correct} right!</h2>
      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 8, margin: "18px 0 28px" }}>
        {results.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: "#1a1a2a", borderRadius: 12, padding: "12px 16px", borderLeft: `4px solid ${r.correct ? "#00B894" : "#FF6B6B"}` }}>
            <span style={{ fontSize: 15, color: r.correct ? "#00B894" : "#FF6B6B", fontWeight: 700 }}>{r.correct ? "✓" : "✗"}</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{r.word}</span>
          </div>
        ))}
      </div>
      <button style={{ ...S.bigBtn, background: `linear-gradient(135deg, ${color}, #A29BFE)` }} onClick={onDone}>
        See Scoreboard →
      </button>
    </div>
  );
}

// ── Scoreboard — explicit team choice ─────────────────────────────────────────
function ScoreboardScreen({ scores, activeTeam, onChooseTeam, onHome }) {
  const leading = scores.A > scores.B ? "A" : scores.B > scores.A ? "B" : null;
  return (
    <div style={S.page}>
      <h2 style={S.sectionTitle}>Scoreboard</h2>
      <div style={{ display: "flex", gap: 14, width: "100%", maxWidth: 400, marginBottom: 32 }}>
        {["A","B"].map(t => (
          <div key={t} style={{ flex: 1, background: "#1a1a2a", borderRadius: 18, padding: "22px 14px", textAlign: "center", border: `2px solid ${leading === t ? TEAM_COLOR[t] : "#ffffff11"}` }}>
            {leading === t && <div style={{ fontSize: 10, fontWeight: 700, color: TEAM_COLOR[t], letterSpacing: 1, marginBottom: 6 }}>LEADING</div>}
            <div style={{ fontSize: 18, fontWeight: 800, color: TEAM_COLOR[t] }}>{TEAMS[t]}</div>
            <div style={{ fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginTop: 8 }}>{scores[t]}</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>points</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 14, color: "#888", marginBottom: 14, textAlign: "center" }}>Who's playing next?</p>
      <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 400, marginBottom: 16 }}>
        {["A","B"].map(t => (
          <button key={t} onClick={() => onChooseTeam(t)} style={{ flex: 1, padding: "18px 0", borderRadius: 16, border: `2px solid ${TEAM_COLOR[t]}`, background: `${TEAM_COLOR[t]}18`, color: TEAM_COLOR[t], fontWeight: 800, fontSize: 16, cursor: "pointer", transition: "background 0.15s" }}>
            {TEAMS[t]}
          </button>
        ))}
      </div>

      <button style={{ ...S.bigBtn, background: "transparent", border: "1.5px solid #2a2a3a", color: "#555" }} onClick={onHome}>
        Back to Lobby
      </button>
    </div>
  );
}

// ── Shared Styles ──────────────────────────────────────────────────────────────
const S = {
  page:         { display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 20px 48px", minHeight: "100vh" },
  logoMark:     { fontSize: 52, marginBottom: 10 },
  bigTitle:     { fontSize: 38, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px", background: "linear-gradient(135deg,#FF6B6B,#4ECDC4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  sectionTitle: { fontSize: 24, fontWeight: 800, marginBottom: 6, textAlign: "center" },
  muted:        { fontSize: 14, color: "#888", marginBottom: 24, textAlign: "center" },
  label:        { fontSize: 13, color: "#aaa", marginBottom: 8, display: "block" },
  card:         { background: "#1a1a2a", borderRadius: 20, padding: "22px 20px", width: "100%", maxWidth: 400, marginBottom: 20 },
  inp:          { background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "13px 15px", color: "#fff", fontSize: 15, width: "100%", outline: "none", fontFamily: "inherit" },
  bigBtn:       { width: "100%", maxWidth: 400, padding: "16px 0", borderRadius: 16, border: "none", fontSize: 16, fontWeight: 700, color: "#fff", cursor: "pointer" },
};
