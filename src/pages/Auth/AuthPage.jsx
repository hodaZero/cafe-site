// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   loginUser,
//   loginWithGoogle,
//   resendVerificationEmail,
//   registerUser
// } from "../../firebase/auth";
// import {
//   AiOutlineEye,
//   AiOutlineEyeInvisible,
//   AiOutlineMail,
//   AiOutlineUser,
//   AiOutlineLock
// } from "react-icons/ai";
// import { FcGoogle } from "react-icons/fc";
// import bgImg from "../../assets/images/im.png";
// import Navbar from "../../components/Navbar";
// import { useTranslation } from "react-i18next";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../firebase/firebaseConfig";

// export default function AuthPage() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [infoMsg, setInfoMsg] = useState("");
//   const [submitError, setSubmitError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // ---------------- Validation ----------------
//   const validateEmail = (email) =>
//     !email ? t("emailRequired") : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : t("emailInvalid");

//   const validatePassword = (password) =>
//     !password ? t("passwordRequired") : password.length < 6 ? t("passwordMin") : "";

//   const validateName = (name) => (!name ? t("nameRequired") : "");

//   const validateConfirmPassword = (password, confirmPassword) =>
//     password !== confirmPassword ? t("passwordMismatch") : "";

//   // ---------------- Role fetch ----------------
//   const fetchUserRole = async (uid) => {
//     const ref = doc(db, "users", uid);
//     const snapshot = await getDoc(ref);
//     return snapshot.exists() ? snapshot.data().role : "user";
//   };

//   const handleLoginRedirect = async (firebaseUser) => {
//     const role = await fetchUserRole(firebaseUser.uid);
//     if (role === "admin") navigate("/admin/products");
//     else navigate("/");
//   };

//   // ---------------- Login ----------------
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrors({}); setInfoMsg(""); setSubmitError(""); setSuccessMsg("");
//     const emailError = validateEmail(formData.email);
//     const passwordError = validatePassword(formData.password);
//     if (emailError || passwordError) return setErrors({ email: emailError, password: passwordError });

//     try {
//       const firebaseUser = await loginUser(formData.email, formData.password);
//       await handleLoginRedirect(firebaseUser);
//     } catch (err) {
//       if (err.message.includes("verify your email")) {
//         setInfoMsg(t("verifyEmailMsg"));
//         try { await resendVerificationEmail(err.user || null); } catch {}
//       } else setSubmitError(err.message);
//     }
//   };

//   // ---------------- Register ----------------
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setErrors({}); setSubmitError(""); setSuccessMsg(""); setInfoMsg("");
//     const nameError = validateName(formData.name);
//     const emailError = validateEmail(formData.email);
//     const passwordError = validatePassword(formData.password);
//     const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
//     if (nameError || emailError || passwordError || confirmError) 
//       return setErrors({ name: nameError, email: emailError, password: passwordError, confirmPassword: confirmError });

//     try {
//       await registerUser(formData.email, formData.password, formData.name);
//       setSuccessMsg(t("registrationSuccess"));
//       setFormData({ name: "", email: "", password: "", confirmPassword: "" });
//     } catch (err) {
//       setSubmitError(err.message);
//     }
//   };

//   // ---------------- Google Login ----------------
//   const handleGoogleLogin = async () => {
//     try {
//       const firebaseUser = await loginWithGoogle();
//       await handleLoginRedirect(firebaseUser);
//     } catch (err) {
//       setSubmitError(err.message);
//     }
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden">
//       {/* ===== Background ===== */}
//       <div
//         className="absolute inset-0 -z-10"
//         style={{
//           backgroundImage: `url(${bgImg})`,
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "left 20% center",
//           filter: "blur(4px)",
//           transform: "scale(1.05)"
//         }}
//       />
//       <div className="absolute inset-0 bg-black/20 -z-10" />

//       <Navbar />

//       {/* ===== Form Wrapper ===== */}
//       <div className="flex justify-end items-start min-h-screen pt-24">
//         <div className="w-full max-w-md p-6 rounded-3xl shadow-2xl bg-white mr-[180px]">

//           {/* Image */}
//           <div className="flex justify-center mb-4">
//             <img src={bgImg} alt="form" className="w-28 h-28 object-contain" />
//           </div>

//           {/* Toggle */}
//           <div className="flex justify-center gap-6 mb-4">
//             <button
//               onClick={() => setIsLogin(true)}
//               className={`font-semibold ${isLogin ? "text-[#b87c4c] underline" : "text-[#8c6239]"}`}
//             >
//               Sign In
//             </button>
//             <button
//               onClick={() => setIsLogin(false)}
//               className={`font-semibold ${!isLogin ? "text-[#b87c4c] underline" : "text-[#8c6239]"}`}
//             >
//               Sign Up
//             </button>
//           </div>

//           <form className="space-y-3" onSubmit={isLogin ? handleLogin : handleRegister}>
//             {!isLogin && (
//               <div className="relative">
//                 <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b]" />
//                 <input
//                   name="name"
//                   placeholder={t("name")}
//                   className="w-full pl-10 py-2 rounded-xl border"
//                   value={formData.name}
//                   onChange={handleChange}
//                 />
//                 {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
//               </div>
//             )}

//             <div className="relative">
//               <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b]" />
//               <input
//                 name="email"
//                 placeholder={t("email")}
//                 className="w-full pl-10 py-2 rounded-xl border"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//               {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//             </div>

//             {!isLogin ? (
//               <div className="flex gap-2">
//                 <div className="relative flex-1">
//                   <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b]" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder={t("password")}
//                     className="w-full pl-10 py-2 rounded-xl border"
//                     value={formData.password}
//                     onChange={handleChange}
//                   />
//                   {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//                 </div>

//                 <div className="relative flex-1">
//                   <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b]" />
//                   <input
//                     type={showConfirm ? "text" : "password"}
//                     name="confirmPassword"
//                     placeholder={t("confirmPassword")}
//                     className="w-full pl-10 py-2 rounded-xl border"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                   />
//                   {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
//                 </div>
//               </div>
//             ) : (
//               <div className="relative">
//                 <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b]" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder={t("password")}
//                   className="w-full pl-10 py-2 rounded-xl border"
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//                 {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//               </div>
//             )}

//             {infoMsg && <p className="text-blue-500 text-center mt-2">{infoMsg}</p>}
//             {successMsg && <p className="text-green-500 text-center mt-2">{successMsg}</p>}
//             {submitError && <p className="text-red-500 text-center mt-2">{submitError}</p>}

//             {/* Submit */}
//             <button className="w-full py-3 bg-[#b87c4c] text-white rounded-xl font-semibold">
//               {isLogin ? t("signIn") : t("signUp")}
//             </button>

//             {/* Forget Password */}
//             {isLogin && (
//               <p
//                 onClick={() => navigate("/forgot-password")}
//                 className="text-center text-sm text-gray-500 cursor-pointer hover:text-[#b87c4c] transition mt-2"
//               >
//                 {t("forgotPassword")}
//               </p>
//             )}

//             {/* Divider */}
//             <div className="flex items-center my-2">
//               <div className="flex-grow border-t" />
//               <span className="mx-2 text-sm text-gray-500">or</span>
//               <div className="flex-grow border-t" />
//             </div>

//             {/* Google */}
//             <div className="flex justify-center">
//               <button
//                 type="button"
//                 onClick={handleGoogleLogin}
//                 className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
//               >
//                 <FcGoogle size={20} />
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   loginUser,
//   loginWithGoogle,
//   resendVerificationEmail,
//   registerUser
// } from "../../firebase/auth";
// import {
//   AiOutlineEye,
//   AiOutlineEyeInvisible,
//   AiOutlineMail,
//   AiOutlineUser,
//   AiOutlineLock
// } from "react-icons/ai";
// import { FcGoogle } from "react-icons/fc";
// import bgImg from "../../assets/images/im.png";
// import Navbar from "../../components/Navbar";
// import { useTranslation } from "react-i18next";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../firebase/firebaseConfig";

// export default function AuthPage() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [infoMsg, setInfoMsg] = useState("");
//   const [submitError, setSubmitError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // ---------------- Validation ----------------
//   const validateEmail = (email) =>
//     !email ? t("emailRequired") : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : t("emailInvalid");

//   const validatePassword = (password) =>
//     !password ? t("passwordRequired") : password.length < 6 ? t("passwordMin") : "";

//   const validateName = (name) => (!name ? t("nameRequired") : "");

//   const validateConfirmPassword = (password, confirmPassword) =>
//     password !== confirmPassword ? t("passwordMismatch") : "";

//   // ---------------- Role fetch ----------------
//   const fetchUserRole = async (uid) => {
//     const ref = doc(db, "users", uid);
//     const snapshot = await getDoc(ref);
//     return snapshot.exists() ? snapshot.data().role : "user";
//   };

//   const handleLoginRedirect = async (firebaseUser) => {
//     const role = await fetchUserRole(firebaseUser.uid);
//     if (role === "admin") navigate("/admin/products");
//     else navigate("/");
//   };

//   // ---------------- Login ----------------
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrors({}); setInfoMsg(""); setSubmitError(""); setSuccessMsg("");
//     const emailError = validateEmail(formData.email);
//     const passwordError = validatePassword(formData.password);
//     if (emailError || passwordError) return setErrors({ email: emailError, password: passwordError });

//     try {
//       const firebaseUser = await loginUser(formData.email, formData.password);
//       await handleLoginRedirect(firebaseUser);
//     } catch (err) {
//       if (err.message.includes("verify your email")) {
//         setInfoMsg(t("verifyEmailMsg"));
//         try { await resendVerificationEmail(err.user || null); } catch {}
//       } else setSubmitError(err.message);
//     }
//   };

//   // ---------------- Register ----------------
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setErrors({}); setSubmitError(""); setSuccessMsg(""); setInfoMsg("");
//     const nameError = validateName(formData.name);
//     const emailError = validateEmail(formData.email);
//     const passwordError = validatePassword(formData.password);
//     const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
//     if (nameError || emailError || passwordError || confirmError) 
//       return setErrors({ name: nameError, email: emailError, password: passwordError, confirmPassword: confirmError });

//     try {
//       await registerUser(formData.email, formData.password, formData.name);
//       setSuccessMsg(t("registrationSuccess"));
//       setFormData({ name: "", email: "", password: "", confirmPassword: "" });
//     } catch (err) {
//       setSubmitError(err.message);
//     }
//   };

//   // ---------------- Google Login ----------------
//   const handleGoogleLogin = async () => {
//     try {
//       const firebaseUser = await loginWithGoogle();
//       await handleLoginRedirect(firebaseUser);
//     } catch (err) {
//       setSubmitError(err.message);
//     }
//   };

//   // ---------------- Toggle Password Visibility ----------------
//   const togglePasswordVisibility = () => setShowPassword(!showPassword);
//   const toggleConfirmVisibility = () => setShowConfirm(!showConfirm);

//   return (
//     <div className="relative min-h-screen overflow-hidden">
//       {/* ===== Background ===== */}
//       <div
//         className="absolute inset-0 -z-10"
//         style={{
//           backgroundImage: `url(${bgImg})`,
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "center",
//           filter: "blur(4px)",
//           transform: "scale(1.05)"
//         }}
//       />
//       <div className="absolute inset-0 bg-black/20 -z-10" />

//       <Navbar />

//       {/* ===== Form Wrapper ===== */}
//       <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen pt-16 lg:pt-24 px-4 lg:px-8">
//         {/* Left Side - Content/Image for larger screens */}
//         <div className="hidden lg:flex flex-col items-center justify-center flex-1 max-w-2xl mb-10 lg:mb-0">
//           <div className="text-center mb-8">
//             <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
//               {t("welcome") || "Welcome to Domicafe"}
//             </h1>
//             <p className="text-xl text-white/90 max-w-lg mx-auto drop-shadow-md">
//               {t("authDescription") || "Experience the finest coffee and atmosphere"}
//             </p>
//           </div>
//           <img 
//             src={bgImg} 
//             alt="Coffee shop" 
//             className="w-64 h-64 lg:w-80 lg:h-80 object-cover rounded-3xl shadow-2xl border-4 border-white/20"
//           />
//         </div>

//         {/* Right Side - Form */}
//         <div className="w-full max-w-md lg:max-w-lg p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl bg-white backdrop-blur-sm bg-white/95">
//           {/* Image for mobile/tablet */}
//           <div className="flex justify-center mb-4 lg:hidden">
//             <img src={bgImg} alt="form" className="w-20 h-20 lg:w-28 lg:h-28 object-contain rounded-full" />
//           </div>

//           {/* Toggle */}
//           <div className="flex justify-center gap-4 lg:gap-6 mb-4 lg:mb-6">
//             <button
//               onClick={() => setIsLogin(true)}
//               className={`font-semibold text-base lg:text-lg px-4 py-2 rounded-lg transition-all duration-300 ${
//                 isLogin 
//                   ? "text-[#b87c4c] bg-[#f8f1e9] border-b-2 border-[#b87c4c]" 
//                   : "text-[#8c6239] hover:text-[#b87c4c]"
//               }`}
//             >
//               {t("signIn") || "Sign In"}
//             </button>
//             <button
//               onClick={() => setIsLogin(false)}
//               className={`font-semibold text-base lg:text-lg px-4 py-2 rounded-lg transition-all duration-300 ${
//                 !isLogin 
//                   ? "text-[#b87c4c] bg-[#f8f1e9] border-b-2 border-[#b87c4c]" 
//                   : "text-[#8c6239] hover:text-[#b87c4c]"
//               }`}
//             >
//               {t("signUp") || "Sign Up"}
//             </button>
//           </div>

//           <form className="space-y-4 lg:space-y-5" onSubmit={isLogin ? handleLogin : handleRegister}>
//             {!isLogin && (
//               <div className="relative">
//                 <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b] text-lg lg:text-xl" />
//                 <input
//                   name="name"
//                   placeholder={t("name") || "Full Name"}
//                   className="w-full pl-12 pr-4 py-3 lg:py-3.5 text-sm lg:text-base rounded-xl lg:rounded-2xl border border-gray-300 focus:border-[#b87c4c] focus:ring-2 focus:ring-[#b87c4c]/20 focus:outline-none transition"
//                   value={formData.name}
//                   onChange={handleChange}
//                 />
//                 {errors.name && <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>}
//               </div>
//             )}

//             <div className="relative">
//               <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b] text-lg lg:text-xl" />
//               <input
//                 name="email"
//                 type="email"
//                 placeholder={t("email") || "Email Address"}
//                 className="w-full pl-12 pr-4 py-3 lg:py-3.5 text-sm lg:text-base rounded-xl lg:rounded-2xl border border-gray-300 focus:border-[#b87c4c] focus:ring-2 focus:ring-[#b87c4c]/20 focus:outline-none transition"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//               {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>}
//             </div>

//             {!isLogin ? (
//               <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
//                 <div className="relative flex-1">
//                   <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b] text-lg lg:text-xl" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder={t("password") || "Password"}
//                     className="w-full pl-12 pr-12 py-3 lg:py-3.5 text-sm lg:text-base rounded-xl lg:rounded-2xl border border-gray-300 focus:border-[#b87c4c] focus:ring-2 focus:ring-[#b87c4c]/20 focus:outline-none transition"
//                     value={formData.password}
//                     onChange={handleChange}
//                   />
//                   <button
//                     type="button"
//                     onClick={togglePasswordVisibility}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b87c4c]"
//                   >
//                     {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
//                   </button>
//                   {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>}
//                 </div>

//                 <div className="relative flex-1">
//                   <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b] text-lg lg:text-xl" />
//                   <input
//                     type={showConfirm ? "text" : "password"}
//                     name="confirmPassword"
//                     placeholder={t("confirmPassword") || "Confirm Password"}
//                     className="w-full pl-12 pr-12 py-3 lg:py-3.5 text-sm lg:text-base rounded-xl lg:rounded-2xl border border-gray-300 focus:border-[#b87c4c] focus:ring-2 focus:ring-[#b87c4c]/20 focus:outline-none transition"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                   />
//                   <button
//                     type="button"
//                     onClick={toggleConfirmVisibility}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b87c4c]"
//                   >
//                     {showConfirm ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
//                   </button>
//                   {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword}</p>}
//                 </div>
//               </div>
//             ) : (
//               <div className="relative">
//                 <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b] text-lg lg:text-xl" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder={t("password") || "Password"}
//                   className="w-full pl-12 pr-12 py-3 lg:py-3.5 text-sm lg:text-base rounded-xl lg:rounded-2xl border border-gray-300 focus:border-[#b87c4c] focus:ring-2 focus:ring-[#b87c4c]/20 focus:outline-none transition"
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b87c4c]"
//                 >
//                   {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
//                 </button>
//                 {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>}
//               </div>
//             )}

//             {/* Messages */}
//             <div className="space-y-1">
//               {infoMsg && <p className="text-blue-500 text-sm text-center bg-blue-50 py-2 rounded-lg">{infoMsg}</p>}
//               {successMsg && <p className="text-green-500 text-sm text-center bg-green-50 py-2 rounded-lg">{successMsg}</p>}
//               {submitError && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{submitError}</p>}
//             </div>

//             {/* Submit Button */}
//             <button 
//               type="submit" 
//               className="w-full py-3 lg:py-4 bg-gradient-to-r from-[#b87c4c] to-[#a36636] text-white text-base lg:text-lg font-semibold rounded-xl lg:rounded-2xl hover:opacity-90 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
//             >
//               {isLogin ? t("signIn") || "Sign In" : t("signUp") || "Sign Up"}
//             </button>

//             {/* Forget Password */}
//             {isLogin && (
//               <p
//                 onClick={() => navigate("/forgot-password")}
//                 className="text-center text-sm lg:text-base text-gray-600 cursor-pointer hover:text-[#b87c4c] transition-colors duration-300 mt-2"
//               >
//                 {t("forgotPassword") || "Forgot your password?"}
//               </p>
//             )}

//             {/* Divider */}
//             <div className="flex items-center my-4 lg:my-6">
//               <div className="flex-grow border-t border-gray-300" />
//               <span className="mx-3 lg:mx-4 text-sm lg:text-base text-gray-500">{t("or") || "or"}</span>
//               <div className="flex-grow border-t border-gray-300" />
//             </div>

//             {/* Google Login */}
//             <div className="flex justify-center">
//               <button
//                 type="button"
//                 onClick={handleGoogleLogin}
//                 className="flex items-center justify-center gap-3 px-6 py-3 lg:px-8 lg:py-3.5 w-full max-w-xs rounded-xl lg:rounded-2xl border-2 border-gray-300 hover:border-[#b87c4c] hover:bg-gray-50 transition-all duration-300 group"
//               >
//                 <FcGoogle size={22} className="lg:w-6 lg:h-6" />
//                 <span className="text-sm lg:text-base font-medium text-gray-700 group-hover:text-[#b87c4c]">
//                   {t("continueWithGoogle") || "Continue with Google"}
//                 </span>
//               </button>
//             </div>

//             {/* Terms & Privacy (for sign up) */}
//             {!isLogin && (
//               <p className="text-xs lg:text-sm text-center text-gray-500 mt-4 px-2">
//                 {t("termsAgreement") || "By signing up, you agree to our Terms of Service and Privacy Policy"}
//               </p>
//             )}
//           </form>
//         </div>
//       </div>

//       {/* Footer note for mobile */}
//       <div className="lg:hidden text-center text-white text-sm mt-8 mb-6 px-4">
//         <p>© {new Date().getFullYear()} Domicafe. All rights reserved.</p>
//       </div>
//     </div>
//   );
// }

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

  // ---------------- Toggle Password Visibility ----------------
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmVisibility = () => setShowConfirm(!showConfirm);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ===== Background فقط - بدون صورة صغيرة ===== */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          filter: "blur(4px)",
          transform: "scale(1.05)"
        }}
      />
      <div className="absolute inset-0 bg-black/20 -z-10" />

      <Navbar />

      {/* ===== Form Wrapper ===== */}
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen pt-16 lg:pt-20 px-4 lg:px-8">
        {/* Left Side - Content for larger screens */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1 max-w-2xl mb-10 lg:mb-0">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {t("welcome") || "Welcome to Domicafe"}
            </h1>
          </div>
          <img 
            src={bgImg} 
            alt="Coffee shop" 
            className="w-64 h-64 lg:w-72 lg:h-72 object-cover rounded-3xl shadow-2xl border-4 border-white/20"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md lg:max-w-lg p-5 lg:p-7 rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl bg-white backdrop-blur-sm bg-white/95">
          {/* Toggle - بدون صورة صغيرة */}
          <div className="flex justify-center gap-4 lg:gap-6 mb-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`font-semibold text-base lg:text-lg px-4 py-2 rounded-lg transition-all duration-300 ${
                isLogin 
                  ? "text-[#b87c4c] bg-[#f8f1e9] border-b-2 border-[#b87c4c]" 
                  : "text-[#8c6239] hover:text-[#b87c4c]"
              }`}
            >
              {t("signIn") || "Sign In"}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`font-semibold text-base lg:text-lg px-4 py-2 rounded-lg transition-all duration-300 ${
                !isLogin 
                  ? "text-[#b87c4c] bg-[#f8f1e9] border-b-2 border-[#b87c4c]" 
                  : "text-[#8c6239] hover:text-[#b87c4c]"
              }`}
            >
              {t("signUp") || "Sign Up"}
            </button>
          </div>

          <form className="space-y-3 lg:space-y-4" onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <div className="relative">
                <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b] text-lg lg:text-xl" />
                <input
                  name="name"
                  placeholder={t("name") || "Full Name"}
                  className="w-full pl-12 pr-4 py-2.5 lg:py-3 text-sm lg:text-base rounded-xl lg:rounded-2xl border border-gray-300 focus:border-[#b87c4c] focus:ring-2 focus:ring-[#b87c4c]/20 focus:outline-none transition"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>}
              </div>
            )}

            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b] text-lg lg:text-xl" />
              <input
                name="email"
                type="email"
                placeholder={t("email") || "Email Address"}
                className="w-full pl-12 pr-4 py-2.5 lg:py-3 text-sm lg:text-base rounded-xl lg:rounded-2xl border border-gray-300 focus:border-[#b87c4c] focus:ring-2 focus:ring-[#b87c4c]/20 focus:outline-none transition"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>}
            </div>

            {!isLogin ? (
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <div className="relative flex-1">
                  <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b] text-lg lg:text-xl" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t("password") || "Password"}
                    className="w-full pl-12 pr-12 py-2.5 lg:py-3 text-sm lg:text-base rounded-xl lg:rounded-2xl border border-gray-300 focus:border-[#b87c4c] focus:ring-2 focus:ring-[#b87c4c]/20 focus:outline-none transition"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b87c4c]"
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </button>
                  {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>}
                </div>

                <div className="relative flex-1">
                  <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b] text-lg lg:text-xl" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder={t("confirmPassword") || "Confirm Password"}
                    className="w-full pl-12 pr-12 py-2.5 lg:py-3 text-sm lg:text-base rounded-xl lg:rounded-2xl border border-gray-300 focus:border-[#b87c4c] focus:ring-2 focus:ring-[#b87c4c]/20 focus:outline-none transition"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b87c4c]"
                  >
                    {showConfirm ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </button>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            ) : (
              <div className="relative">
                <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b69b7b] text-lg lg:text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t("password") || "Password"}
                  className="w-full pl-12 pr-12 py-2.5 lg:py-3 text-sm lg:text-base rounded-xl lg:rounded-2xl border border-gray-300 focus:border-[#b87c4c] focus:ring-2 focus:ring-[#b87c4c]/20 focus:outline-none transition"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b87c4c]"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>}
              </div>
            )}

            {/* Messages */}
            <div className="space-y-1 mt-1">
              {infoMsg && <p className="text-blue-500 text-sm text-center bg-blue-50 py-1.5 rounded-lg">{infoMsg}</p>}
              {successMsg && <p className="text-green-500 text-sm text-center bg-green-50 py-1.5 rounded-lg">{successMsg}</p>}
              {submitError && <p className="text-red-500 text-sm text-center bg-red-50 py-1.5 rounded-lg">{submitError}</p>}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-2.5 lg:py-3 bg-gradient-to-r from-[#b87c4c] to-[#a36636] text-white text-base lg:text-lg font-semibold rounded-xl lg:rounded-2xl hover:opacity-90 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl mt-2"
            >
              {isLogin ? t("signIn") || "Sign In" : t("signUp") || "Sign Up"}
            </button>

            {/* Forget Password */}
            {isLogin && (
              <p
                onClick={() => navigate("/forgot-password")}
                className="text-center text-sm lg:text-base text-gray-600 cursor-pointer hover:text-[#b87c4c] transition-colors duration-300 mt-1"
              >
                {t("forgotPassword") || "Forgot your password?"}
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center my-3 lg:my-4">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-3 lg:mx-4 text-sm lg:text-base text-gray-500">{t("or") || "or"}</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 px-4 py-2.5 lg:px-6 lg:py-3 w-full max-w-xs rounded-xl lg:rounded-2xl border-2 border-gray-300 hover:border-[#b87c4c] hover:bg-gray-50 transition-all duration-300 group"
              >
                <FcGoogle size={20} className="lg:w-5 lg:h-5" />
                <span className="text-sm lg:text-base font-medium text-gray-700 group-hover:text-[#b87c4c]">
                  {t("continueWithGoogle") || "Continue with Google"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer note for mobile */}
      <div className="lg:hidden text-center text-white text-sm mt-6 mb-4 px-4">
        <p>© {new Date().getFullYear()} Domicafe. All rights reserved.</p>
      </div>
    </div>
  );
}