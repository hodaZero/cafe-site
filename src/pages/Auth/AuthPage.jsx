import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  loginWithGoogle,
  resendVerificationEmail,
  registerUser
} from "../../firebase/auth";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineLock
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import bgImg from "../../assets/images/im.png";
import Navbar from "../../components/Navbar";
import { useTranslation } from "react-i18next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [infoMsg, setInfoMsg] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ---------------- Validation ----------------
  const validateEmail = (email) =>
    !email ? t("emailRequired") : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : t("emailInvalid");

  const validatePassword = (password) =>
    !password ? t("passwordRequired") : password.length < 6 ? t("passwordMin") : "";

  const validateName = (name) => (!name ? t("nameRequired") : "");

  const validateConfirmPassword = (password, confirmPassword) =>
    password !== confirmPassword ? t("passwordMismatch") : "";

  // ---------------- Role fetch ----------------
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

  // ---------------- Login ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({}); setInfoMsg(""); setSubmitError(""); setSuccessMsg("");
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

  // ---------------- Register ----------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({}); setSubmitError(""); setSuccessMsg(""); setInfoMsg("");
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (nameError || emailError || passwordError || confirmError) 
      return setErrors({ name: nameError, email: emailError, password: passwordError, confirmPassword: confirmError });

    try {
      await registerUser(formData.email, formData.password, formData.name);
      setSuccessMsg(t("registrationSuccess"));
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  // ---------------- Google Login ----------------
  const handleGoogleLogin = async () => {
    try {
      const firebaseUser = await loginWithGoogle();
      await handleLoginRedirect(firebaseUser);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ===== Background ===== */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left 20% center",
          filter: "blur(4px)",
          transform: "scale(1.05)"
        }}
      />
      <div className="absolute inset-0 bg-black/20 -z-10" />

      <Navbar />

      {/* ===== Form Wrapper ===== */}
      <div className="flex justify-end items-start min-h-screen pt-24">
        <div className="w-full max-w-md p-6 rounded-3xl shadow-2xl bg-white mr-[180px]">

          {/* Image */}
          <div className="flex justify-center mb-4">
            <img src={bgImg} alt="form" className="w-28 h-28 object-contain" />
          </div>

          {/* Toggle */}
          <div className="flex justify-center gap-6 mb-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`font-semibold ${isLogin ? "text-[#b87c4c] underline" : "text-[#8c6239]"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`font-semibold ${!isLogin ? "text-[#b87c4c] underline" : "text-[#8c6239]"}`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-3" onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <div className="relative">
                <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b]" />
                <input
                  name="name"
                  placeholder={t("name")}
                  className="w-full pl-10 py-2 rounded-xl border"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
            )}

            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b]" />
              <input
                name="email"
                placeholder={t("email")}
                className="w-full pl-10 py-2 rounded-xl border"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {!isLogin ? (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t("password")}
                    className="w-full pl-10 py-2 rounded-xl border"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <div className="relative flex-1">
                  <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b]" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder={t("confirmPassword")}
                    className="w-full pl-10 py-2 rounded-xl border"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>
            ) : (
              <div className="relative">
                <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t("password")}
                  className="w-full pl-10 py-2 rounded-xl border"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            )}

            {infoMsg && <p className="text-blue-500 text-center mt-2">{infoMsg}</p>}
            {successMsg && <p className="text-green-500 text-center mt-2">{successMsg}</p>}
            {submitError && <p className="text-red-500 text-center mt-2">{submitError}</p>}

            {/* Submit */}
            <button className="w-full py-3 bg-[#b87c4c] text-white rounded-xl font-semibold">
              {isLogin ? t("signIn") : t("signUp")}
            </button>

            {/* Forget Password */}
            {isLogin && (
              <p
                onClick={() => navigate("/forgot-password")}
                className="text-center text-sm text-gray-500 cursor-pointer hover:text-[#b87c4c] transition mt-2"
              >
                {t("forgotPassword")}
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center my-2">
              <div className="flex-grow border-t" />
              <span className="mx-2 text-sm text-gray-500">or</span>
              <div className="flex-grow border-t" />
            </div>

            {/* Google */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
              >
                <FcGoogle size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
