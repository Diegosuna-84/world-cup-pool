import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import Navbar from "../components/Navbar";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <Navbar />
      <div style={{ maxWidth: "400px", margin: "4rem auto", padding: "1rem" }}>
        <div style={{ background: "#141414", padding: "2.5rem", borderRadius: "20px", border: "1px solid #222" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔒</div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "0.5rem" }}>Set New Password</h2>
            <p style={{ color: "#555", fontSize: "0.9rem" }}>Enter your new password below</p>
          </div>

          {error && (
            <p style={{ color: "#e63946", textAlign: "center", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</p>
          )}

          {success ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#4ade80", fontSize: "0.95rem" }}>Password updated! Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                <input type={showPassword ? "text" : "password"} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1px solid #222", background: "#0d0d0d", color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }} />
                <span onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#555", fontSize: "0.85rem" }}>
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <input type={showPassword ? "text" : "password"} placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                style={{ width: "100%", padding: "0.8rem 1rem", marginBottom: "1.5rem", borderRadius: "10px", border: "1px solid #222", background: "#0d0d0d", color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }} />
              <button type="submit"
                style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "none", background: "#e63946", color: "#fff", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;