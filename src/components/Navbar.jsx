import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import logo from "../assets/Wc_pool_logo.png";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    navigate("/");
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogoutAndClose = async () => {
    await handleLogout();
    setMenuOpen(false);
  };

  const navButtonStyle = {
    background: "#141414",
    color: "#aaa",
    border: "1px solid #222",
    borderRadius: "10px",
    padding: "0.45rem 0.9rem",
    cursor: "pointer",
    fontSize: "0.85rem",
  };

  const outButtonStyle = {
    background: "transparent",
    color: "#e63946",
    border: "1px solid #e63946",
    borderRadius: "10px",
    padding: "0.45rem 0.9rem",
    cursor: "pointer",
    fontSize: "0.85rem",
  };

  return (
    <nav
      style={{
        padding: "1rem 1.5rem",
        borderBottom: "1px solid #222",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#0a0a0a",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LOGO */}
      <span
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          color: "#fff",
          fontSize: "1.1rem",
          fontWeight: "700",
        }}
      >
        <img src={logo} alt="WC Pool" style={{ height: "40px" }} /> WC 2026 Pool
      </span>

      {/* LINKS */}
      {user ? (
        isMobile ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "#141414",
                color: "#fff",
                border: "1px solid #222",
                borderRadius: "10px",
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
                fontSize: "1.2rem",
                lineHeight: 1,
              }}
            >
              ☰
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "#141414",
                  border: "1px solid #222",
                  borderRadius: "10px",
                  padding: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  minWidth: "160px",
                }}
              >
                <button onClick={() => goTo("/matches")} style={navButtonStyle}>
                  ⚽ Matches
                </button>
                <button onClick={() => goTo("/leaderboard")} style={navButtonStyle}>
                  🏆 Board
                </button>
                <button onClick={() => goTo("/profile")} style={navButtonStyle}>
                  👤 {user.name}
                </button>
                <button onClick={handleLogoutAndClose} style={outButtonStyle}>
                  Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={() => navigate("/matches")} style={navButtonStyle}>
              ⚽ Matches
            </button>
            <button onClick={() => navigate("/leaderboard")} style={navButtonStyle}>
              🏆 Board
            </button>
            <button onClick={() => navigate("/profile")} style={navButtonStyle}>
              👤 {user.name}
            </button>
            <button onClick={handleLogout} style={outButtonStyle}>
              Out
            </button>
          </div>
        )
      ) : (
        <span style={{ color: "#555", fontSize: "0.85rem" }}>
          Sign in to make predictions
        </span>
      )}
    </nav>
  );
}

export default Navbar;