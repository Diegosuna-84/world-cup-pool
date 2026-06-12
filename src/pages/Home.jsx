import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import Navbar from "../components/Navbar";

function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data.articles || []);
        setNewsLoading(false);
      })
      .catch(() => setNewsLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error || !data) {
        setError("Invalid email or password");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/matches");
    } else {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (existing) {
        setError("Email already registered");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .insert([{ email, password, name: name || email.split("@")[0] }])
        .select()
        .single();

      if (error) {
        setError("Something went wrong. Try again.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/matches");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <Navbar />

      <div style={{ display: "flex", flexDirection: window.innerWidth < 768 ? "column" : "row", gap: "2rem", padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>

        {/* LEFT — News */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "#fff" }}>
            ⚽ World Cup 2026 News
          </h2>
          {newsLoading ? (
            <p style={{ color: "#555" }}>Loading news...</p>
          ) : (
            news.map((article, i) => (
              <a key={i} href={article.url} target="_blank" rel="noreferrer"
                style={{ display: "flex", gap: "1rem", marginBottom: "1rem", background: "#141414", borderRadius: "12px", padding: "0.75rem", border: "1px solid #222", textDecoration: "none" }}>
                {article.urlToImage && (
                  <img src={article.urlToImage} alt=""
                    style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                )}
                <div>
                  <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.25rem", lineHeight: "1.4" }}>
                    {article.title}
                  </p>
                  <p style={{ color: "#555", fontSize: "0.75rem" }}>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </a>
            ))
          )}
        </div>

        {/* RIGHT — Welcome or Login */}
        <div style={{ width: window.innerWidth < 768 ? "100%" : "360px", flexShrink: 0 }}>
          {user ? (
            <div style={{ background: "#141414", padding: "2rem", borderRadius: "20px", border: "1px solid #222", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚽</div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>Welcome back, {user.name}!</h2>
              <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Ready to make your predictions?</p>
              <button onClick={() => navigate("/matches")}
                style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "none", background: "#e63946", color: "#fff", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
                Go to Matches
              </button>
            </div>
          ) : (
            <div style={{ background: "#141414", padding: "2.5rem", borderRadius: "20px", border: "1px solid #222" }}>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚽</div>
                <h2 style={{ fontSize: "1.6rem", fontWeight: "700", marginBottom: "0.5rem" }}>WC 2026 Pool</h2>
                <p style={{ color: "#555", fontSize: "0.9rem" }}>
                  {isLogin ? "Welcome back" : "Create your account"}
                </p>
              </div>

              {error && (
                <p style={{ color: "#e63946", textAlign: "center", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</p>
              )}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%", padding: "0.8rem 1rem", marginBottom: "0.75rem", borderRadius: "10px", border: "1px solid #222", background: "#0d0d0d", color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }} />
                )}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  style={{ width: "100%", padding: "0.8rem 1rem", marginBottom: "0.75rem", borderRadius: "10px", border: "1px solid #222", background: "#0d0d0d", color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  style={{ width: "100%", padding: "0.8rem 1rem", marginBottom: "1.5rem", borderRadius: "10px", border: "1px solid #222", background: "#0d0d0d", color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }} />
                <button type="submit"
                  style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "none", background: "#e63946", color: "#fff", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
                  {isLogin ? "Login" : "Sign Up"}
                </button>
              </form>

              <p style={{ color: "#555", textAlign: "center", marginTop: "1.25rem", fontSize: "0.9rem", cursor: "pointer" }}
                onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;