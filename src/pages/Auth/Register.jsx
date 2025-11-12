import React, { useState } from "react";
import backgroundPic from "../../assets/images/backgroundPic.jpg";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is invalid";
    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", formData);
      alert("Registration successful!");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-12 pb-12">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundPic})` }}
      ></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white bg-opacity-20 p-14 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Register
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d3ad7f] text-base"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d3ad7f] text-base"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d3ad7f] text-base"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#d3ad7f] text-black py-2.5 rounded-md hover:bg-[#b38a5f] transition text-base font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-white text-base">
          Already have an account?{" "}
          <a href="/login" className="text-[#d3ad7f] font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
