import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundPic from "../../assets/images/backgroundPic.jpg";
import { loginUser } from "../../firebase/auth";
import { useTheme } from "../../context/ThemeContext";

const Login = () => {
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email is invalid";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password) && !/[a-z]/.test(password))
      return "Password must contain letters";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({});

    try {
      const user = await loginUser(formData.email, formData.password);

      // توجيه حسب ال role
      if (user.role === "admin") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err.message);
      alert("Error: " + err.message);
    }
  };

  const cardBg =
    theme === "light"
      ? "bg-light-surface bg-opacity-90 text-light-text"
      : "bg-dark-surface bg-opacity-90 text-dark-text";

  const inputBorder =
    theme === "light"
      ? "border-light-inputBorder"
      : "border-dark-inputBorder";

  const primaryBtn =
    theme === "light"
      ? "bg-light-primary hover:bg-light-primaryHover text-black"
      : "bg-dark-primary hover:bg-dark-primaryHover text-dark-text";

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundPic})` }}
      ></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div
        className={`relative z-10 p-14 rounded-xl shadow-xl w-full max-w-md transition-colors duration-300 ${cardBg}`}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-6 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary text-lg ${inputBorder}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-6 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary text-lg ${inputBorder}`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-md transition text-lg font-semibold ${primaryBtn}`}
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-lg">
          Don't have an account?{" "}
          <a
            href="/register"
            className={`font-semibold ${
              theme === "light" ? "text-light-primary" : "text-dark-primary"
            }`}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
