import React from "react";

export default function ProductForm({ form, setForm, onSubmit, categories, loading }) {
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="bg-dark p-4 rounded-xl">
      <div className="grid grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="p-2 rounded bg-black border border-primary text-white"
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          placeholder="Price"
          className="p-2 rounded bg-black border border-primary text-white"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="p-2 rounded bg-black border border-primary text-white"
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
          className="p-2 rounded bg-black border border-primary text-white"
        />
        <input
          name="prepTime"
          value={form.prepTime || ""}
          onChange={handleChange}
          placeholder="Preparation Time (min)"
          type="number"
          className="p-2 rounded bg-black border border-primary text-white"
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
          className="p-2 rounded bg-black border border-primary text-white"
        />
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 rounded bg-black border border-primary text-white col-span-2 h-24"
        />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          className="bg-primary text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#7FBFD4] transition"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
