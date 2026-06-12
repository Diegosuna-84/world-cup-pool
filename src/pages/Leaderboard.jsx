import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../services/supabase";

function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from("leaderboard")
        .select("*")
        .order("total_points", { ascending: false });
      if (data) setPlayers(data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{ maxWidth: "480px", margin: "0 auto", padding: "1.5rem 1rem" }}
      >
        <h2 style={{ color: "#fff", marginBottom: "1.5rem" }}>
          🏆 Leaderboard
        </h2>
        {players.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center", marginTop: "2rem" }}>
            No predictions yet. Be the first!
          </p>
        ) : (
          players.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#1a1a2e",
                borderRadius: "12px",
                padding: "1rem 1.5rem",
                marginBottom: "0.75rem",
                border: i === 0 ? "1px solid #e63946" : "1px solid #16213e",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <span
                  style={{
                    color: i === 0 ? "#e63946" : "#888",
                    fontWeight: "700",
                  }}
                >
                  #{i + 1}
                </span>
                <span style={{ color: "#fff" }}>{p.name}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#4cc9f0", fontWeight: "700" }}>
                  {p.total_points} pts
                </span>
                <p style={{ color: "#555", fontSize: "0.75rem", margin: 0 }}>
                  {p.total_predictions} predictions
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
