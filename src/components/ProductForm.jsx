import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ProductForm({ form, setForm, onSubmit, categories, loading }) {
  const { theme } = useTheme();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const inputBg = theme === "light" ? "bg-light-input" : "bg-dark-input";
  const inputBorder = theme === "light" ? "border-light-inputBorder" : "border-dark-inputBorder";
  const inputText = theme === "light" ? "text-light-text" : "text-dark-text";
  const formBg = theme === "light" ? "bg-light-surface" : "bg-dark-surface";
  const btnBg = theme === "light" ? "bg-light-primary" : "bg-dark-primary";
  const btnHover = theme === "light" ? "hover:bg-light-primaryHover" : "hover:bg-dark-primaryHover";
  const btnText = theme === "light" ? "text-light-text" : "text-dark-text";

  return (
    <form onSubmit={onSubmit} className={`${formBg} p-4 rounded-xl`}>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText}`}
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          placeholder="Price"
          className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText}`}
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText}`}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText}`}
        />
        <input
          name="prepTime"
          value={form.prepTime || ""}
          onChange={handleChange}
          placeholder="Preparation Time (min)"
          type="number"
          className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText}`}
        />
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
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Description"
          className={`p-2 rounded ${inputBg} ${inputBorder} ${inputText} col-span-2 h-24`}
        />
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
