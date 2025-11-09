import React, { useState } from "react";
import backgroundPic from "../../assets/images/backgroundPic.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({});
    console.log("Form submitted:", formData);
    alert("Login successful!");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundPic})` }}
      ></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white bg-opacity-20 p-16 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-lg">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-6 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-lg">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-6 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-opacity-90 transition text-lg font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-white text-lg">
          Don't have an account?{" "}
          <a href="/register" className="text-primary font-semibold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
