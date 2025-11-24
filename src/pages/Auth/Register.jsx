import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundPic from "../../assets/images/backgroundPic.jpg";
import { registerUser } from "../../firebase/auth";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

const Register = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [submitError, setSubmitError] = useState("");

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
    if (!/[A-Za-z]/.test(password)) return "Password must contain letters";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    return "";
  };

  const validateName = (name) => {
    if (!name) return "Name is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMsg("");

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (nameError || emailError || passwordError) {
      setErrors({ name: nameError, email: emailError, password: passwordError });
      return;
    }

    setErrors({});

    try {
      await registerUser(formData.email, formData.password, formData.name);
      setSuccessMsg(
        "Registration successful! Please check your email to verify your account."
      );
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const cardBg =
    theme === "light"
      ? "bg-light-surface bg-opacity-90 text-light-text"
      : "bg-dark-surface bg-opacity-90 text-dark-text";

  const inputBorder =
    theme === "light" ? "border-light-inputBorder bg-light-input" : "border-dark-inputBorder bg-dark-input";

  const primaryBtn =
    theme === "light"
      ? "bg-light-primary hover:bg-light-primaryHover text-black"
      : "bg-dark-primary hover:bg-dark-primaryHover text-dark-text";

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundPic})` }}
      ></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div
        className={`relative z-10 p-10 sm:p-12 rounded-xl shadow-xl w-full max-w-sm transition-colors duration-300 ${cardBg}`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Register</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 sm:py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-lg ${inputBorder}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 sm:py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-lg ${inputBorder}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 sm:py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-lg ${inputBorder}`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 sm:py-3 rounded-md transition text-base sm:text-lg font-semibold ${primaryBtn}`}
          >
            Register
          </button>
        </form>

        {submitError && <p className="text-red-500 mt-4 text-center">{submitError}</p>}
        {successMsg && <p className="text-green-500 mt-4 text-center">{successMsg}</p>}

        <p className="text-center mt-4 text-base sm:text-lg">
          Already have an account?{" "}
        <Link
              to="/login"
              className={`font-semibold ${
                theme === "light" ? "text-light-primary" : "text-dark-primary"
              }`}
            >
              Login
            </Link>

        </p>
      </div>
    </div>
  );
};

export default Register;
