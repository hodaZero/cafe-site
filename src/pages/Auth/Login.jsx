import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundPic from "../../assets/images/backgroundPic.jpg";
import { loginUser, loginWithGoogle, resendVerificationEmail } from "../../firebase/auth";
import { useTheme } from "../../context/ThemeContext";
import { FcGoogle } from "react-icons/fc";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // تأكدي من export الـ db من firebaseConfig

const Login = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email is invalid";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setInfoMsg("");

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }
    setErrors({});

    try {
      const firebaseUser = await loginUser(formData.email, formData.password);

      await handleLoginRedirect(firebaseUser);

    } catch (err) {
      if (err.message.includes("verify your email")) {
        setInfoMsg("Please verify your email. A verification link has been sent.");
        try { await resendVerificationEmail(err.user || null); } catch (sendErr) { console.log(sendErr.message); }
      } else {
        setLoginError(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const firebaseUser = await loginWithGoogle();
      await handleLoginRedirect(firebaseUser);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const cardBg = theme === "light" ? "bg-light-surface bg-opacity-90 text-black" : "bg-dark-surface bg-opacity-90 text-black";
  const inputBorder = theme === "light" ? "border-light-inputBorder" : "border-dark-inputBorder";
  const primaryBtn = theme === "light" ? "bg-light-primary hover:bg-light-primaryHover text-black" : "bg-dark-primary hover:bg-dark-primaryHover text-black";

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundPic})` }}></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className={`relative z-10 p-10 sm:p-12 rounded-xl shadow-xl w-full max-w-sm transition-colors duration-300 ${cardBg}`}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange}
              className={`w-full px-4 py-2 sm:py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary text-black text-base sm:text-lg ${inputBorder}`} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange}
              className={`w-full px-4 py-2 sm:py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary text-black text-base sm:text-lg ${inputBorder}`} />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <p className="text-blue-600 text-sm mt-2 cursor-pointer" onClick={() => navigate("/forgot-password")}>Forgot password?</p>

          <button type="submit" className={`w-full py-2 sm:py-3 rounded-md transition text-base sm:text-lg font-semibold ${primaryBtn}`}>Login</button>
        </form>

        <button onClick={handleGoogleLogin} className={`mt-4 w-full flex items-center justify-center gap-2 py-2 sm:py-3 rounded-md border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-base sm:text-lg`}>
          <FcGoogle size={24} /> Login with Google
        </button>

        {loginError && <p className="text-red-500 mt-4 text-center">{loginError}</p>}
        {infoMsg && <p className="text-blue-500 mt-4 text-center">{infoMsg}</p>}

        <p className="text-center mt-4 text-base sm:text-lg">
          Don't have an account? <a href="/register" className={`font-semibold ${theme === "light" ? "text-light-primary" : "text-dark-primary"}`}>Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
