import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import Navbar from "../components/Navbar";

function EditProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState(user?.name || "");
  const [bg, setBg] = useState(user?.background || "#0a0a0a");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    const wantsPasswordChange = newPassword || confirmPassword || currentPassword;

    if (wantsPasswordChange) {
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        return;
      }
      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
      }
      if (!currentPassword) {
        setError("Enter your current password to change it.");
        return;
      }
    }

    setLoading(true);

    let avatarUrl = user?.avatar_url || null;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `${user.id}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        setError("Failed to upload image.");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      avatarUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ name, avatar_url: avatarUrl, background: bg })
      .eq("id", user.id);

    if (updateError) {
      setError("Failed to save profile changes.");
      setLoading(false);
      return;
    }

    if (wantsPasswordChange) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        setError("Current password is incorrect.");
        setLoading(false);
        return;
      }

      const { error: passwordUpdateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passwordUpdateError) {
        setError(passwordUpdateError.message);
        setLoading(false);
        return;
      }
    }

    const updatedUser = { ...user, name, avatar_url: avatarUrl, background: bg };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("bgchange"));

    setSuccess("Profile updated.");
    setLoading(false);
    navigate("/profile");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <Navbar />
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "1.5rem 1rem" }}>

        <p
          onClick={() => navigate("/profile")}
          style={{ color: "#888", fontSize: "0.85rem", cursor: "pointer", marginBottom: "1rem" }}
        >
          ← Back to Profile
        </p>

        <div style={{ background: "#1a1a2e", borderRadius: "16px", padding: "2rem", border: "1px solid #16213e" }}>
          <h4 style={{ color: "#fff", marginBottom: "1.5rem" }}>✏️ Edit Profile</h4>

          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 1rem", overflow: "hidden", background: "#e63946", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "1.8rem", fontWeight: "700", color: "#fff" }}>{user?.name?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <label style={{ cursor: "pointer", color: "#aaa", fontSize: "0.85rem", border: "1px solid #222", borderRadius: "10px", padding: "0.45rem 0.9rem", background: "#141414" }}>
              Upload Photo
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
            </label>
          </div>

          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "0.8rem 1rem", marginBottom: "1rem", borderRadius: "10px", border: "1px solid #222", background: "#0d0d0d", color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>App background color</p>
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              style={{ width: "48px", height: "48px", border: "none", borderRadius: "8px", cursor: "pointer", background: "transparent" }}
            />
          </div>

          <h4 style={{ color: "#fff", marginBottom: "1rem", borderTop: "1px solid #222", paddingTop: "1.5rem" }}>🔒 Change Password</h4>
          <p style={{ color: "#555", fontSize: "0.8rem", marginBottom: "1rem" }}>Leave blank to keep your current password.</p>

          <div style={{ position: "relative", marginBottom: "0.75rem" }}>
            <input type={showCurrentPassword ? "text" : "password"} placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1px solid #222", background: "#0d0d0d", color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }} />
            <span onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#555", fontSize: "0.85rem" }}>
              {showCurrentPassword ? "Hide" : "Show"}
            </span>
          </div>

          <div style={{ position: "relative", marginBottom: "0.75rem" }}>
            <input type={showNewPassword ? "text" : "password"} placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1px solid #222", background: "#0d0d0d", color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }} />
            <span onClick={() => setShowNewPassword(!showNewPassword)}
              style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#555", fontSize: "0.85rem" }}>
              {showNewPassword ? "Hide" : "Show"}
            </span>
          </div>

          <input type={showNewPassword ? "text" : "password"} placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "0.8rem 1rem", marginBottom: "0.5rem", borderRadius: "10px", border: "1px solid #222", background: "#0d0d0d", color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }} />

          <p onClick={() => navigate("/forgot-password")} style={{ color: "#555", fontSize: "0.8rem", textAlign: "right", cursor: "pointer", marginBottom: "1.5rem" }}>
            Forgot password?
          </p>

          {error && <p style={{ color: "#e63946", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{error}</p>}
          {success && <p style={{ color: "#4ade80", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{success}</p>}

          <button onClick={handleSave} disabled={loading}
            style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "none", background: "#e63946", color: "#fff", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditProfile;