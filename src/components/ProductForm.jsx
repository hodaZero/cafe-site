import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { uploadImage } from "../sevices/storage_sevices";

export default function ProductForm({ form, setForm, onSubmit, categories, loading }) {
  const { theme } = useTheme();
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(form.image || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setForm({ ...form, image: preview });
 await onSubmit();
    setUploadingImage(true);
    try {
      const url = await uploadImage("domi_cafe", file); 
      setForm({ ...form, image: url });
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploadingImage(false);
    }
  };
  const validate = () => {
    const newErrors = {};
    if (!form.name || form.name.trim().length < 2) newErrors.name = "Name is required (min 2 characters)";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) newErrors.price = "Price must be a number > 0";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.image || !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(form.image)) newErrors.image = "Image must be a valid URL ending with jpg/jpeg/png/gif";
    if (!form.prepTime || isNaN(form.prepTime) || Number(form.prepTime) <= 0) newErrors.prepTime = "Preparation time must be > 0";
    if (form.rating === "" || isNaN(form.rating) || Number(form.rating) < 0 || Number(form.rating) > 5) newErrors.rating = "Rating must be 0-5";
    if (!form.description || form.description.trim().length < 10) newErrors.description = "Description min 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit();
  };

  // --- Colors aligned with ProductsDashboard ---
  const inputBg = theme === "light" ? "bg-light-input text-light-text border-light-inputBorder" : "bg-dark-input text-dark-text border-dark-inputBorder";
  const btnPrimary = theme === "light" ? "bg-light-primary text-black hover:bg-light-primaryHover" : "bg-dark-primary text-black hover:bg-dark-primaryHover";
  const formBg = theme === "light" ? "bg-light-surface" : "bg-dark-surface";

  return (
    <form onSubmit={handleSubmit} className={`${formBg} p-6 rounded-2xl shadow-md transition-colors duration-300`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className={`w-full p-3 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price ($)</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            className={`w-full p-3 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
<div className="col-span-1 md:col-span-2 flex items-start gap-4 ">
        {/* Category */}
        <div>
          <label className="block mb-1 font-medium flex-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-primary`}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

       {/* Image Upload */}
<div className="col-span-1 md:col-span-2 flex flex-col items-center gap-2 w-fit mx-auto">
  <label className="block font-medium mb-1 ">Product Image</label>
  
  <label className={`p-3 rounded-lg border cursor-pointer text-center ${inputBg}`}>
    {selectedFile ? "Change Image" : "Upload Image"}
    <input type="file" accept="image/*" className="hidden " onChange={handleFileChange} />
  </label>
  {preview && (
    <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded mt-2" />
  )}
</div>
</div>

        {/* Preparation Time */}
        <div>
          <label className="block mb-1 font-medium">Preparation Time (min)</label>
          <input
            name="prepTime"
            value={form.prepTime || ""}
            onChange={handleChange}
            type="number"
            placeholder="e.g. 15"
            className={`w-full p-3 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.prepTime && <p className="text-red-500 text-sm mt-1">{errors.prepTime}</p>}
        </div>

        {/* Rating */}
        <div>
          <label className="block mb-1 font-medium">Rating (0-5)</label>
          <input
            name="rating"
            value={form.rating || ""}
            onChange={handleChange}
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="e.g. 4.5"
            className={`w-full p-3 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
        </div>

        {/* Description */}
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            placeholder="Describe the product (min 10 characters)"
            className={`w-full p-3 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-primary h-28 resize-none`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Submit */}
           <div className="mt-6 flex justify-center">
        <button
          type="submit"
          disabled={uploadingImage || loading}
          className={`px-8 py-3 rounded-xl font-semibold ${btnPrimary} transition transform hover:scale-105`}
        >
          {uploadingImage || loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
