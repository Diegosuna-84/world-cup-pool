import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import Navbar from "../components/Navbar";

function EditProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
  const [nameSuccess, setNameSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveName = async () => {
    setNameError("");
    setNameSuccess("");
    setLoading(true);

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `${user.id}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        setNameError("Failed to upload image.");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      await supabase.from("users").update({ avatar_url: urlData.publicUrl, name }).eq("id", user.id);
      const updatedUser = { ...user, name, avatar_url: urlData.publicUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      await supabase.from("users").update({ name }).eq("id", user.id);
      const updatedUser = { ...user, name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    setNameSuccess("Profile updated.");
    setLoading(false);
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (signInError) {
      setPasswordError("Current password is incorrect.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
      setLoading(false);
      return;
    }

    setPasswordSuccess("Password updated.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <Navbar />
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Profile Picture + Name */}
        <div style={{ background: "#1a1a2e", borderRadius: "16px", padding: "2rem", border: "1px solid #16213e", marginBottom: "1rem" }}>
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

          {nameError && <p style={{ color: "#e63946", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{nameError}</p>}
          {nameSuccess && <p style={{ color: "#4ade80", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{nameSuccess}</p>}

          <button onClick={handleSaveName} disabled={loading}
            style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "none", background: "#e63946", color: "#fff", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
            Save Changes
          </button>
        </div>

        {/* Change Password */}
        <div style={{ background: "#1a1a2e", borderRadius: "16px", padding: "2rem", border: "1px solid #16213e" }}>
          <h4 style={{ color: "#fff", marginBottom: "1.5rem" }}>🔒 Change Password</h4>

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

          <p onClick={() => navigate("/forgot-password")} style={{ color: "#555", fontSize: "0.8rem", textAlign: "right", cursor: "pointer", marginBottom: "1rem" }}>
            Forgot password?
          </p>

          {passwordError && <p style={{ color: "#e63946", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{passwordError}</p>}
          {passwordSuccess && <p style={{ color: "#4ade80", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{passwordSuccess}</p>}

          <button onClick={handleChangePassword} disabled={loading}
            style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "none", background: "#e63946", color: "#fff", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
            Update Password
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditProfile;