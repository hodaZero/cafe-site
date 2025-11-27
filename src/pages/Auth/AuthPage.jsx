import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundPic from "../../assets/images/backgroundPic.jpg";
import { loginUser, loginWithGoogle, resendVerificationEmail, registerUser } from "../../firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useTheme } from "../../context/ThemeContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { motion } from "framer-motion";

export default function AuthPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [infoMsg, setInfoMsg] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const validateEmail = (email) => !email ? "Email is required" : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Email is invalid";
  const validatePassword = (password) => !password ? "Password is required" : password.length < 6 ? "Password must be at least 6 characters" : "";
  const validateName = (name) => (!name ? "Name is required" : "");

  const fetchUserRole = async (uid) => {
    const ref = doc(db, "users", uid);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? snapshot.data().role : "user";
  };

  const handleLoginRedirect = async (firebaseUser) => {
    const role = await fetchUserRole(firebaseUser.uid);
    if (role === "admin") navigate("/admin/products");
    else navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({}); setInfoMsg(""); setSubmitError("");
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    if (emailError || passwordError) return setErrors({ email: emailError, password: passwordError });

    try {
      const firebaseUser = await loginUser(formData.email, formData.password);
      await handleLoginRedirect(firebaseUser);
    } catch (err) {
      if (err.message.includes("verify your email")) {
        setInfoMsg("Please verify your email. A verification link has been sent.");
        try { await resendVerificationEmail(err.user || null); } catch {}
      } else setSubmitError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({}); setSubmitError(""); setSuccessMsg("");
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    if (nameError || emailError || passwordError) return setErrors({ name: nameError, email: emailError, password: passwordError });

    try {
      await registerUser(formData.email, formData.password, formData.name);
      setSuccessMsg("Registration successful! Check your email to verify your account.");
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const firebaseUser = await loginWithGoogle();
      await handleLoginRedirect(firebaseUser);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  // ---------------- Theme-based colors ----------------
  const cardBg = theme === "light"
    ? "bg-gradient-to-br from-light-background/90 to-light-surface/90 text-light-text shadow-2xl"
    : "bg-gradient-to-br from-dark-background/90 to-dark-surface/90 text-dark-text shadow-2xl";

  const inputBorder = theme === "light"
    ? "border-light-inputBorder bg-light-input placeholder-gray-400"
    : "border-dark-inputBorder bg-dark-input placeholder-gray-500";

  const primaryBtn = theme === "light"
    ? "bg-light-primary hover:bg-light-primaryHover text-white"
    : "bg-dark-primary hover:bg-dark-primaryHover text-black";

  const focusRing = theme === "light" ? "focus:ring-light-primary" : "focus:ring-dark-primaryHover";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundPic})` }} />
      <div className={`absolute inset-0 ${theme === "light" ? "bg-light-background/50" : "bg-dark-background/60"} backdrop-blur-sm`}></div>

      {/* Auth Card */}
      <motion.div
        className={`relative z-10 p-10 sm:p-12 rounded-2xl w-full max-w-md ${cardBg}`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.form
          key={isLogin ? "login" : "signup"}
          className="space-y-4"
          onSubmit={isLogin ? handleLogin : handleRegister}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isLogin && (
            <input type="text" name="name" placeholder="Name"
              className={`w-full px-4 py-3 rounded-xl border ${inputBorder} focus:ring-2 ${focusRing} outline-none transition`}
              value={formData.name} onChange={handleChange} />
          )}
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input type="email" name="email" placeholder="Email"
            className={`w-full px-4 py-3 rounded-xl border ${inputBorder} focus:ring-2 ${focusRing} outline-none transition`}
            value={formData.email} onChange={handleChange} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input type="password" name="password" placeholder="Password"
            className={`w-full px-4 py-3 rounded-xl border ${inputBorder} focus:ring-2 ${focusRing} outline-none transition`}
            value={formData.password} onChange={handleChange} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          {isLogin && (
            <p className={`${theme === "light" ? "text-light-primary" : "text-dark-primaryHover"} text-sm cursor-pointer text-right`} onClick={() => navigate("/forgot-password")}>Forgot password?</p>
          )}

          <button type="submit" className={`w-full py-3 rounded-xl font-semibold ${primaryBtn}`}>
            {isLogin ? "Sign In" : "Sign Up"}
          </button>

          <button type="button" onClick={handleGoogleLogin}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl border border-light-primary hover:scale-105 transition-transform">
            <FcGoogle size={22} /> {isLogin ? "Sign In with Google" : "Sign Up with Google"}
          </button>

          {infoMsg && <p className="text-blue-500 text-center mt-2">{infoMsg}</p>}
          {successMsg && <p className="text-green-500 text-center mt-2">{successMsg}</p>}
          {submitError && <p className="text-red-500 text-center mt-2">{submitError}</p>}
        </motion.form>

        {/* Toggle buttons under the form */}
        <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
          <button className={`font-semibold ${isLogin ? "underline text-light-primary" : "hover:text-light-primary"}`} onClick={() => setIsLogin(true)}>Sign In</button>
          <span>|</span>
          <button className={`font-semibold ${!isLogin ? "underline text-light-primary" : "hover:text-light-primary"}`} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>
      </motion.div>
    </div>
  );
}
