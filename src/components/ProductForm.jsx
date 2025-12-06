import React, { useState } from "react";
import { uploadImage } from "../sevices/storage_sevices";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function ProductForm({
  form,
  setForm,
  onSubmit,
  categories,
  loading,
}) {
  const { theme } = useTheme();
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(form.image || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return form.image || null;
    setUploadingImage(true);
    try {
      const url = await uploadImage("domi_cafe", selectedFile);
      setForm((prev) => ({ ...prev, image: url }));
      setSelectedFile(null);
      setPreview(url);
      return url;
    } catch (err) {
      console.error("Error uploading image:", err);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name || form.name.trim().length < 2)
      newErrors.name = "Name min 2 characters";

    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      newErrors.price = "Price must be > 0";

    if (!form.category) newErrors.category = "Category is required";

    if (!form.image && !selectedFile)
      newErrors.image = "Image is required";

    if (!form.prepTime || isNaN(form.prepTime) || Number(form.prepTime) <= 0)
      newErrors.prepTime = "Prep time must be > 0";

    if (
      form.rating === "" ||
      isNaN(form.rating) ||
      Number(form.rating) < 0 ||
      Number(form.rating) > 5
    )
      newErrors.rating = "Rating 0–5";

    if (!form.description || form.description.trim().length < 10)
      newErrors.description = "Description min 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let imageUrl = form.image;

    if (selectedFile) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) return;
    }

    const finalData = {
      ...form,
      image: imageUrl,
    };

    onSubmit(finalData);
  };

  const inputBg =
    theme === "light"
      ? "bg-light-input text-light-text border-light-inputBorder"
      : "bg-dark-input text-dark-text border-dark-inputBorder";

  const btnPrimary =
    theme === "light"
      ? "bg-light-primary text-black hover:bg-light-primaryHover"
      : "bg-dark-primary text-black hover:bg-dark-primaryHover";

  const formBg = theme === "light" ? "bg-light-surface" : "bg-dark-surface";

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`${formBg} p-5 md:p-6 rounded-2xl shadow-lg w-full max-w-3xl mx-auto 
      transition-colors duration-300 
      max-h-[80vh] overflow-y-auto scrollbar-hide `}   
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className={`w-full p-2.5 md:p-3 rounded-lg border ${inputBg} 
            focus:outline-none focus:ring-2 focus:ring-primary`}
            type="text"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price ($)</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            className={`w-full p-2.5 md:p-3 rounded-lg border ${inputBg} 
            focus:outline-none focus:ring-2 focus:ring-primary`}
            type="text"   
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* Category + Image */}
        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-start gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`w-full p-2.5 md:p-3 rounded-lg border ${inputBg} 
              focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 w-fit mx-auto">
            <label className="block font-medium mb-1">Product Image</label>
            <label
              className={`p-2.5 md:p-3 rounded-lg border cursor-pointer text-center 
              ${inputBg} hover:scale-105 transition`}
            >
              {selectedFile ? "Change Image" : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {preview && (
              <motion.img
                src={preview}
                alt="Preview"
                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded border mt-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}

            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>
        </div>

        {/* Prep Time */}
        <div>
          <label className="block mb-1 font-medium">Preparation Time (min)</label>
          <input
            name="prepTime"
            value={form.prepTime || ""}
            onChange={handleChange}
            placeholder="e.g. 15"
            className={`w-full p-2.5 md:p-3 rounded-lg border ${inputBg} 
            focus:outline-none focus:ring-2 focus:ring-primary`}
            type="text"  
          />
          {errors.prepTime && (
            <p className="text-red-500 text-sm mt-1">{errors.prepTime}</p>
          )}
        </div>

        {/* Rating */}
        <div>
          <label className="block mb-1 font-medium">Rating (0–5)</label>
          <input
            name="rating"
            value={form.rating || ""}
            onChange={handleChange}
            placeholder="e.g. 4.5"
            className={`w-full p-2.5 md:p-3 rounded-lg border ${inputBg} 
            focus:outline-none focus:ring-2 focus:ring-primary`}
            type="text"   // ← removed min/max/step
          />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Description */}
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            placeholder="Describe the product (min 10 characters)"
            className={`w-full p-2.5 md:p-3 rounded-lg border ${inputBg} 
            h-24 md:h-28 resize-none focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="mt-5 flex justify-center">
        <motion.button
          type="submit"
          disabled={uploadingImage || loading}
          className={`px-6 md:px-8 py-2.5 rounded-xl font-semibold ${btnPrimary}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {uploadingImage || loading ? "Saving..." : "Save Product"}
        </motion.button>
      </div>
    </motion.form>
  );
}
