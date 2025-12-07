import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundPic from "../../assets/images/backgroundPic.jpg";
import { loginUser, loginWithGoogle, resendVerificationEmail, registerUser } from "../../firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useTheme } from "../../context/ThemeContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useTranslation } from "react-i18next";

export default function AuthPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [infoMsg, setInfoMsg] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const validateEmail = (email) => !email ? t("emailRequired") : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : t("emailInvalid");
  const validatePassword = (password) => !password ? t("passwordRequired") : password.length < 6 ? t("passwordMin6") : "";
  const validateName = (name) => (!name ? t("nameRequired") : "");

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
        setInfoMsg(t("verifyEmailMsg"));
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
      setSuccessMsg(t("registrationSuccess"));
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
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundPic})` }} />
      <div className={`absolute inset-0 ${theme === "light" ? "bg-light-background/50" : "bg-dark-background/60"} backdrop-blur-sm`}></div>

      <div className={`relative z-10 p-10 sm:p-12 rounded-2xl w-full max-w-md ${cardBg}`}>
        <form
          key={isLogin ? "login" : "signup"}
          className="space-y-4"
          onSubmit={isLogin ? handleLogin : handleRegister}
        >
          {!isLogin && (
            <input type="text" name="name" placeholder={t("name")}
              className={`w-full px-4 py-3 rounded-xl border ${inputBorder} focus:ring-2 ${focusRing} outline-none transition`}
              value={formData.name} onChange={handleChange} />
          )}
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input type="email" name="email" placeholder={t("email")}
            className={`w-full px-4 py-3 rounded-xl border ${inputBorder} focus:ring-2 ${focusRing} outline-none transition`}
            value={formData.email} onChange={handleChange} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("password")}
              className={`w-full px-4 py-3 rounded-xl border ${inputBorder} focus:ring-2 ${focusRing} outline-none transition`}
              value={formData.password} onChange={handleChange}
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          {isLogin && (
            <p className={`${theme === "light" ? "text-light-primary" : "text-dark-primaryHover"} text-sm cursor-pointer text-right`} onClick={() => navigate("/forgot-password")}>
              {t("forgotPassword")}
            </p>
          )}

          <button type="submit" className={`w-full py-3 rounded-xl font-semibold ${primaryBtn}`}>
            {isLogin ? t("signIn") : t("signUp")}
          </button>

          <button type="button" onClick={handleGoogleLogin}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl border border-light-primary hover:scale-105 transition-transform">
            <FcGoogle size={22} /> {isLogin ? t("signInGoogle") : t("signUpGoogle")}
          </button>

          {infoMsg && <p className="text-blue-500 text-center mt-2">{infoMsg}</p>}
          {successMsg && <p className="text-green-500 text-center mt-2">{successMsg}</p>}
          {submitError && <p className="text-red-500 text-center mt-2">{submitError}</p>}
        </form>

        <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
          <button className={`font-semibold ${isLogin ? "underline text-light-primary" : "hover:text-light-primary"}`} onClick={() => setIsLogin(true)}>
            {t("signIn")}
          </button>
          <span>|</span>
          <button className={`font-semibold ${!isLogin ? "underline text-light-primary" : "hover:text-light-primary"}`} onClick={() => setIsLogin(false)}>
            {t("signUp")}
          </button>
        </div>
      </div>
    </div>
  );
}
