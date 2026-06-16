import { useState, useEffect } from "react";
import { getMatches } from "../services/prediction";
import { supabase } from "../services/supabase";
import Navbar from "../components/Navbar";

function MatchCard({ match }) {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const checkExisting = async () => {
      const { data } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", user.id)
        .eq("match_id", match.id)
        .maybeSingle();

      if (data) {
        setSubmitted(true);
        setHomeScore(data.user_pick.split("-")[0]);
        setAwayScore(data.user_pick.split("-")[1]);
      }
    };
    checkExisting();
  }, [match.id]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await supabase.from("predictions").insert([
        {
          user_id: user.id,
          match_id: String(match.id),
          user_pick: `${homeScore}-${awayScore}`,
          points: 0,
        },
      ]);

      const { data: existing } = await supabase
        .from("leaderboard")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("leaderboard")
          .update({
            total_predictions: existing.total_predictions + 1,
            updated_at: new Date(),
          })
          .eq("user_id", user.id);
      } else {
        await supabase.from("leaderboard").insert([
          {
            user_id: user.id,
            name: user.name,
            total_points: 0,
            total_predictions: 1,
          },
        ]);
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#141414", borderRadius: "20px", padding: "1.5rem", border: "1px solid #222", marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <span style={{ background: "#1a2e1a", color: "#4ade80", fontSize: "0.75rem", fontWeight: "600", padding: "4px 10px", borderRadius: "20px" }}>
          Group {match.group}
        </span>
        <span style={{ color: "#555", fontSize: "0.8rem" }}>{match.date}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ textAlign: "center", flex: 1 }}>
          <img src={`https://flagsapi.com/${match.code_home}/flat/64.png`} alt={match.home}
            style={{ width: "64px", height: "64px", objectFit: "contain", display: "block", margin: "0 auto 0.5rem" }} />
          <p style={{ color: "#fff", fontWeight: "600", fontSize: "0.95rem", marginBottom: "0.75rem" }}>{match.home}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <button onClick={() => setHomeScore((s) => Math.max(0, s - 1))} disabled={submitted}
              style={{ background: "#222", color: submitted ? "#444" : "#fff", border: "1px solid #333", borderRadius: "8px", width: "32px", height: "32px", cursor: submitted ? "not-allowed" : "pointer", fontSize: "1.1rem" }}>−</button>
            <span style={{ color: submitted ? "#4ade80" : "#fff", fontSize: "1.8rem", fontWeight: "700", minWidth: "28px", textAlign: "center" }}>{homeScore}</span>
            <button onClick={() => setHomeScore((s) => s + 1)} disabled={submitted}
              style={{ background: "#222", color: submitted ? "#444" : "#fff", border: "1px solid #333", borderRadius: "8px", width: "32px", height: "32px", cursor: submitted ? "not-allowed" : "pointer", fontSize: "1.1rem" }}>+</button>
          </div>
        </div>

        <span style={{ color: "#333", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "2px" }}>VS</span>

        <div style={{ textAlign: "center", flex: 1 }}>
          <img src={`https://flagsapi.com/${match.code_away}/flat/64.png`} alt={match.away}
            style={{ width: "64px", height: "64px", objectFit: "contain", display: "block", margin: "0 auto 0.5rem" }} />
          <p style={{ color: "#fff", fontWeight: "600", fontSize: "0.95rem", marginBottom: "0.75rem" }}>{match.away}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <button onClick={() => setAwayScore((s) => Math.max(0, s - 1))} disabled={submitted}
              style={{ background: "#222", color: submitted ? "#444" : "#fff", border: "1px solid #333", borderRadius: "8px", width: "32px", height: "32px", cursor: submitted ? "not-allowed" : "pointer", fontSize: "1.1rem" }}>−</button>
            <span style={{ color: submitted ? "#4ade80" : "#fff", fontSize: "1.8rem", fontWeight: "700", minWidth: "28px", textAlign: "center" }}>{awayScore}</span>
            <button onClick={() => setAwayScore((s) => s + 1)} disabled={submitted}
              style={{ background: "#222", color: submitted ? "#444" : "#fff", border: "1px solid #333", borderRadius: "8px", width: "32px", height: "32px", cursor: submitted ? "not-allowed" : "pointer", fontSize: "1.1rem" }}>+</button>
          </div>
        </div>
      </div>

      {submitted && (
        <div style={{ textAlign: "center", marginBottom: "1rem", padding: "0.75rem", background: "#0d0d0d", borderRadius: "12px", border: "1px solid #1a3a1a" }}>
          <p style={{ color: "#555", fontSize: "0.75rem", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>Your Prediction Saved</p>
          <p style={{ color: "#4ade80", fontSize: "1.4rem", fontWeight: "700" }}>{homeScore} — {awayScore}</p>
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading || submitted}
        style={{ width: "100%", padding: "0.85rem", borderRadius: "12px", border: "none", background: submitted ? "#1a1a1a" : loading ? "#333" : "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)", color: submitted ? "#555" : "#000", fontWeight: "700", fontSize: "0.95rem", cursor: submitted ? "not-allowed" : "pointer", letterSpacing: "0.5px" }}>
        {submitted ? "✓ Prediction Locked In" : loading ? "Saving..." : "Submit My Pick"}
      </button>
    </div>
  );
}

function processMatches(data, setMatchdays, setCurrentMatchday, setLoading) {
  const grouped = {};
  data.forEach(match => {
    const day = match.matchday || 1;
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(match);
  });
  const days = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));
  setMatchdays(days.map(d => grouped[d]));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let startDay = 0;
  for (let i = 0; i < days.length; i++) {
    const dayMatches = grouped[days[i]];
    const hasUpcoming = dayMatches.some(m => new Date(m.date) >= today);
    if (hasUpcoming) {
      startDay = i;
      break;
    }
  }
  setCurrentMatchday(startDay);
  setLoading(false);
}

function Matches() {
  const [matchdays, setMatchdays] = useState([]);
  const [currentMatchday, setCurrentMatchday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem('matches');
    if (cached) {
      processMatches(JSON.parse(cached), setMatchdays, setCurrentMatchday, setLoading);
      return;
    }
    getMatches().then((data) => {
      sessionStorage.setItem('matches', JSON.stringify(data));
      processMatches(data, setMatchdays, setCurrentMatchday, setLoading);
    });
  }, []);

  const currentMatches = matchdays[currentMatchday] || [];

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "1.5rem 1rem" }}>

        {!loading && matchdays.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", background: "#141414", borderRadius: "12px", padding: "0.75rem 1rem", border: "1px solid #222" }}>
            <button onClick={() => setCurrentMatchday(d => Math.max(0, d - 1))} disabled={currentMatchday === 0}
              style={{ background: "transparent", color: currentMatchday === 0 ? "#333" : "#fff", border: "none", cursor: currentMatchday === 0 ? "not-allowed" : "pointer", fontSize: "1.2rem" }}>
              ←
            </button>
            <span style={{ color: "#fff", fontWeight: "600", fontSize: "0.9rem" }}>
              Matchday {currentMatchday + 1} of {matchdays.length}
            </span>
            <button onClick={() => setCurrentMatchday(d => Math.min(matchdays.length - 1, d + 1))} disabled={currentMatchday === matchdays.length - 1}
              style={{ background: "transparent", color: currentMatchday === matchdays.length - 1 ? "#333" : "#fff", border: "none", cursor: currentMatchday === matchdays.length - 1 ? "not-allowed" : "pointer", fontSize: "1.2rem" }}>
              →
            </button>
          </div>
        )}

        {loading ? (
          <p style={{ color: "#555", textAlign: "center" }}>Loading matches...</p>
        ) : (
          currentMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        )}

      </div>
    </div>
  );
}

export default Matches;
