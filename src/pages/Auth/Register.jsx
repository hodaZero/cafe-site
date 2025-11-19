import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundPic from "../../assets/images/backgroundPic.jpg";
import { registerUser } from "../../firebase/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
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

  const validateName = (name) => {
    if (!name) return "Name is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (nameError || emailError || passwordError) {
      setErrors({ name: nameError, email: emailError, password: passwordError });
      return;
    }

    setErrors({});

    try {
      const user = await registerUser(formData.email, formData.password, formData.name);
      console.log("User registered:", user);

      // بعد التسجيل، نوجه المستخدم مباشرة للـ Home
      navigate("/");
    } catch (err) {
      console.error(err.message);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundPic})` }}
      ></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white bg-opacity-20 p-14 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Register
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-6 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
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
              className="w-full px-6 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
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
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-white text-lg">
          Already have an account?{" "}
          <a href="/login" className="text-primary font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
