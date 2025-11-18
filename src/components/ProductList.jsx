// import React, { useState, useEffect } from "react";
// import ProductCard from "./ProductCard";
// import { getProducts } from "../firebase/firestore"; 

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [filterPrice, setFilterPrice] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 6;

//   // Fetch products from Firestore
//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getProducts();
//       setProducts(data);
//     };
//     fetchData();
//   }, []);

//   // Filter & Search
//   const filteredProducts = products
//     .filter(p =>
//       p.name.toLowerCase().includes(search.toLowerCase()) ||
//       p.category.toLowerCase().includes(search.toLowerCase())
//     )
//     .filter(p =>
//       filterCategory === "All" ? true : p.category === filterCategory
//     )
//     .sort((a, b) => {
//       if (filterPrice === "LowToHigh") return a.price - b.price;
//       if (filterPrice === "HighToLow") return b.price - a.price;
//       return 0;
//     });

//   // Pagination
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//   return (
//     <div>
//       {/* Search & Filters */}
//       <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="p-2 rounded bg-gray-800 text-white w-full md:w-1/3"
//         />

//         <select
//           value={filterCategory}
//           onChange={(e) => setFilterCategory(e.target.value)}
//           className="p-2 rounded bg-gray-800 text-white"
//         >
//           <option value="All">All Categories</option>
//           <option value="Drinks">Drinks</option>
//           <option value="Cake">Cake</option>
//           <option value="Desserts">Desserts</option>
//         </select>

//         <select
//           value={filterPrice}
//           onChange={(e) => setFilterPrice(e.target.value)}
//           className="p-2 rounded bg-gray-800 text-white"
//         >
//           <option value="All">Default</option>
//           <option value="LowToHigh">Price: Low → High</option>
//           <option value="HighToLow">Price: High → Low</option>
//         </select>
//       </div>

//       {/* Product Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-10">
//         {currentProducts.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center gap-2 mt-6">
//         {Array.from({ length: totalPages }, (_, i) => (
//           <button
//             key={i}
//             onClick={() => setCurrentPage(i + 1)}
//             className={`px-3 py-1 rounded ${
//               currentPage === i + 1 ? "bg-[#d3ad7f]" : "bg-gray-700"
//             }`}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductList;




import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "../firebase/firestore";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchData();
  }, []);

  const filteredProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    )
    .filter(p =>
      filterCategory === "All" ? true : p.category === filterCategory
    )
    .sort((a, b) => {
      if (filterPrice === "LowToHigh") return a.price - b.price;
      if (filterPrice === "HighToLow") return b.price - a.price;
      return 0;
    });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6 mt-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-dark text-white w-full md:w-1/3 border border-primary placeholder-white"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 rounded bg-dark text-white border border-primary"
        >
          <option value="All">All Categories</option>
          <option value="Drinks">Drinks</option>
          <option value="Cake">Cake</option>
          <option value="Desserts">Desserts</option>
        </select>

        <select
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          className="p-2 rounded bg-dark text-white border border-primary"
        >
          <option value="All">Default</option>
          <option value="LowToHigh">Price: Low → High</option>
          <option value="HighToLow">Price: High → Low</option>
        </select>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-10">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border border-primary ${
              currentPage === i + 1 ? "bg-primary text-black" : "bg-dark text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
