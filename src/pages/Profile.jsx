import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../services/supabase";
import appLogo from "../assets/Wc_pool_logo.png";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [bg, setBg] = useState("#0a0a0a");
  const [stats, setStats] = useState({ total_points: 0, total_predictions: 0 });
  const [favorites, setFavorites] = useState([]);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teamSearch, setTeamSearch] = useState("");
  const [allTeams, setAllTeams] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from("leaderboard")
        .select("total_points, total_predictions")
        .eq("user_id", user.id)
        .single();
      if (data) setStats(data);
    };

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("users")
        .select("background")
        .eq("id", user.id)
        .single();
      if (data?.background) setBg(data.background);
    };

    const fetchFavorites = async () => {
      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id);
      if (data) setFavorites(data);
    };

    const fetchTeams = async () => {
      const response = await fetch("/api/teams");
      const data = await response.json();
      const teams = (data.response || []).map((t) => ({
        name: t.team.name,
        code: t.team.id,
        logo: t.team.logo,
      }));
      setAllTeams(teams);
    };

    fetchStats();
    fetchProfile();
    fetchFavorites();
    fetchTeams();
  }, []);

  const changeBg = async (color) => {
    setBg(color);
    window.dispatchEvent(new Event("bgchange"));
    await supabase
      .from("users")
      .update({ background: color })
      .eq("id", user.id);
  };

  const addFavorite = async (team) => {
    const already = favorites.find((f) => f.team_code === String(team.code));
    if (already) return;
    const { data, error } = await supabase
      .from("favorites")
      .insert([
        {
          user_id: user.id,
          team_name: team.name,
          team_code: String(team.code),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Add favorite failed:", error);
      return;
    }

    if (data) setFavorites([...favorites, data]);
    setShowAddTeam(false);
    setTeamSearch("");
  };

  const removeFavorite = async (id) => {
    await supabase.from("favorites").delete().eq("id", id);
    setFavorites(favorites.filter((f) => f.id !== id));
  };

  const filteredTeams = allTeams.filter(
    (t) =>
      t.name.toLowerCase().includes(teamSearch.toLowerCase()) &&
      !favorites.find((f) => f.team_code === String(t.code)),
  );

  return (
    <div style={{ minHeight: "100vh", background: bg }}>
      <Navbar />
      <div
        style={{ maxWidth: "480px", margin: "0 auto", padding: "1.5rem 1rem" }}
      >
        {/* Profile Card */}
        <div
          style={{
            background: "#1a1a2e",
            borderRadius: "16px",
            padding: "2rem",
            border: "1px solid #16213e",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "#e63946",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "1.8rem",
              fontWeight: "700",
              color: "#fff",
              overflow: "hidden",
            }}
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              user?.name?.[0]?.toUpperCase()
            )}
          </div>
          <h3 style={{ color: "#fff", marginBottom: "0.25rem" }}>
            {user?.name}
          </h3>
          <p style={{ color: "#888", marginBottom: "1rem" }}>{user?.email}</p>
          <button
            onClick={() => navigate("/edit-profile")}
            style={{
              background: "#141414",
              color: "#aaa",
              border: "1px solid #222",
              borderRadius: "10px",
              padding: "0.45rem 0.9rem",
              cursor: "pointer",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            ✏️ Edit Profile
          </button>
          <div style={{ marginBottom: "1.5rem" }}>
            <p
              style={{
                color: "#888",
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
              }}
            >
              App background color
            </p>
            <input
              type="color"
              value={bg}
              onChange={(e) => changeBg(e.target.value)}
              style={{
                width: "48px",
                height: "48px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                background: "transparent",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <p
                style={{
                  color: "#4cc9f0",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                {stats.total_points}
              </p>
              <p style={{ color: "#888", fontSize: "0.85rem" }}>Points</p>
            </div>
            <div>
              <p
                style={{
                  color: "#4cc9f0",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                {stats.total_predictions}
              </p>
              <p style={{ color: "#888", fontSize: "0.85rem" }}>Predictions</p>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        <div
          style={{
            background: "#1a1a2e",
            borderRadius: "16px",
            padding: "1.5rem",
            border: "1px solid #16213e",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h4 style={{ color: "#fff", margin: 0 }}>⭐ Favorite Teams</h4>
            <button
              onClick={() => setShowAddTeam(!showAddTeam)}
              style={{
                background: "#e63946",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "0.45rem 0.9rem",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              + Add
            </button>
          </div>

          {showAddTeam && (
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Search team..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid #222",
                  background: "#0d0d0d",
                  color: "#fff",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                  marginBottom: "0.5rem",
                }}
              />
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {filteredTeams.map((team) => (
                  <div
                    key={team.code}
                    onClick={() => addFavorite(team)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: "#141414",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <img
                      src={team.logo}
                      alt={team.name}
                      onError={(e) => {
                        e.currentTarget.src = appLogo;
                        e.currentTarget.onerror = null;
                      }}
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "contain",
                      }}
                    />
                    <span style={{ color: "#fff", fontSize: "0.9rem" }}>
                      {team.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {favorites.length === 0 ? (
            <p
              style={{
                color: "#555",
                fontSize: "0.85rem",
                textAlign: "center",
              }}
            >
              No favorite teams yet
            </p>
          ) : (
            favorites.map((fav) => (
              <div
                key={fav.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem",
                  background: "#141414",
                  borderRadius: "10px",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <img
                    src={`https://media.api-sports.io/football/teams/${fav.team_code}.png`}
                    alt={fav.team_name}
                    onError={(e) => {
                      e.currentTarget.src = appLogo;
                      e.currentTarget.onerror = null;
                    }}
                    style={{
                      width: "32px",
                      height: "32px",
                      objectFit: "contain",
                    }}
                  />
                  <span style={{ color: "#fff", fontSize: "0.9rem" }}>
                    {fav.team_name}
                  </span>
                </div>
                <button
                  onClick={() => removeFavorite(fav.id)}
                  style={{
                    background: "transparent",
                    color: "#e63946",
                    border: "1px solid #e63946",
                    borderRadius: "8px",
                    padding: "0.3rem 0.6rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;