import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ProductForm({ form, setForm, onSubmit, categories, loading }) {
  const { theme } = useTheme();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name || form.name.trim().length < 2) {
      newErrors.name = "Name is required (min 2 characters)";
    }

    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      newErrors.price = "Price must be a number greater than 0";
    }

    if (!form.category) {
      newErrors.category = "Category is required";
    }

    if (!form.image || !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(form.image)) {
      newErrors.image = "Image must be a valid URL ending with jpg/jpeg/png/gif";
    }

    if (!form.prepTime || isNaN(form.prepTime) || Number(form.prepTime) <= 0) {
      newErrors.prepTime = "Preparation time must be a number greater than 0";
    }

    if (
      form.rating === "" ||
      isNaN(form.rating) ||
      Number(form.rating) < 0 ||
      Number(form.rating) > 5
    ) {
      newErrors.rating = "Rating must be a number between 0 and 5";
    }

    if (!form.description || form.description.trim().length < 10) {
      newErrors.description = "Description is required (min 10 characters)";
    }

    setErrors(newErrors);

    // يرجع true لو مفيش errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const inputBg = theme === "light" ? "bg-light-input" : "bg-dark-input";
  const inputBorder = theme === "light" ? "border-light-inputBorder" : "border-dark-inputBorder";
  const inputText = theme === "light" ? "text-light-text" : "text-dark-text";
  const formBg = theme === "light" ? "bg-light-surface" : "bg-dark-surface";
  const btnBg = theme === "light" ? "bg-light-primary" : "bg-dark-primary";
  const btnHover = theme === "light" ? "hover:bg-light-primaryHover" : "hover:bg-dark-primaryHover";
  const btnText = theme === "light" ? "text-light-text" : "text-dark-text";

  return (
    <form onSubmit={handleSubmit} className={`${formBg} p-4 rounded-xl`}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            placeholder="Price"
            className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText}`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText}`}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText}`}
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>

        <div>
          <input
            name="prepTime"
            value={form.prepTime || ""}
            onChange={handleChange}
            placeholder="Preparation Time (min)"
            type="number"
            className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText}`}
          />
          {errors.prepTime && <p className="text-red-500 text-sm mt-1">{errors.prepTime}</p>}
        </div>

        <div>
          <input
            name="rating"
            value={form.rating || ""}
            onChange={handleChange}
            placeholder="Rating (0-5)"
            type="number"
            min="0"
            max="5"
            step="0.1"
            className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText}`}
          />
          {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
        </div>

        <div className="col-span-2">
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            placeholder="Description"
            className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText} h-24`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          className={`px-6 py-2 rounded-lg font-semibold ${btnBg} ${btnText} ${btnHover} transition`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
