import React from "react";
import backgroundPic from "../../assets/images/backgroundPic.jpg";

const Register = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundPic})` }}
      ></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="relative z-10 bg-white bg-opacity-20 p-16 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-white-800">Register</h2>
        <form className="space-y-6">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-6 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-6 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-6 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-opacity-90 transition text-lg font-semibold"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-6 text-white-800 text-lg">
          Already have an account?{" "}
          <a href="/" className="text-primary font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
