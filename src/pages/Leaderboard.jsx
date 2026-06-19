import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../services/supabase";

function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data: leaderboardData } = await supabase
        .from("leaderboard")
        .select("*")
        .order("total_points", { ascending: false });

      if (!leaderboardData) return;

      const userIds = leaderboardData.map((p) => p.user_id);
      const { data: usersData } = await supabase
        .from("users")
        .select("id, avatar_url")
        .in("id", userIds);

      const avatarById = {};
      (usersData || []).forEach((u) => {
        avatarById[u.id] = u.avatar_url;
      });

      const merged = leaderboardData.map((p) => ({
        ...p,
        avatar_url: avatarById[p.user_id] || null,
      }));

      setPlayers(merged);
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
                style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
              >
                <span
                  style={{
                    color: i === 0 ? "#e63946" : "#888",
                    fontWeight: "700",
                  }}
                >
                  #{i + 1}
                </span>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#e63946",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "#fff",
                  }}
                >
                  {p.avatar_url ? (
                    <img
                      src={p.avatar_url}
                      alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    p.name?.[0]?.toUpperCase()
                  )}
                </div>
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