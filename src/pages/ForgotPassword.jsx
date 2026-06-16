import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import Navbar from "../components/Navbar";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://wcpool.kadowebstudio.com/reset-password"
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <Navbar />
      <div style={{ maxWidth: "400px", margin: "4rem auto", padding: "1rem" }}>
        <div style={{ background: "#141414", padding: "2.5rem", borderRadius: "20px", border: "1px solid #222" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔑</div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "0.5rem" }}>Reset Password</h2>
            <p style={{ color: "#555", fontSize: "0.9rem" }}>Enter your email and we'll send you a reset link</p>
          </div>

          {error && (
            <p style={{ color: "#e63946", textAlign: "center", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</p>
          )}

          {sent ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#4ade80", fontSize: "0.95rem", marginBottom: "1.5rem" }}>Email sent! Check your inbox for the reset link.</p>
              <button onClick={() => navigate("/")}
                style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "none", background: "#e63946", color: "#fff", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ width: "100%", padding: "0.8rem 1rem", marginBottom: "1.5rem", borderRadius: "10px", border: "1px solid #222", background: "#0d0d0d", color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }} />
              <button type="submit"
                style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "none", background: "#e63946", color: "#fff", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
                Send Reset Link
              </button>
            </form>
          )}

          {!sent && (
            <p onClick={() => navigate("/")} style={{ color: "#555", textAlign: "center", marginTop: "1.25rem", fontSize: "0.9rem", cursor: "pointer" }}>
              Back to Login
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;