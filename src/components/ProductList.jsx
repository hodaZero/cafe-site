import React from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Tasty & Healthy Coffee",
    price: 40,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=60",
    description: "A smooth and creamy coffee blend made with fresh beans and a touch of sweetness.",
    rating: 4.5,
    prepTime: "5 min",
  },
  {
    id: 2,
    name: "Cappuccino",
    price: 50,
    image: "https://images.unsplash.com/photo-1588776814546-8c7bfe91a30c?auto=format&fit=crop&w=500&q=60",
    description: "Classic cappuccino with a perfect layer of foam, made with freshly brewed espresso.",
    rating: 4.8,
    prepTime: "6 min",
  },
  {
    id: 3,
    name: "Latte",
    price: 60,
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=500&q=60",
    description: "Smooth latte with creamy milk and rich espresso, perfect for your morning routine.",
    rating: 4.7,
    prepTime: "7 min",
  },
  {
    id: 4,
    name: "Mocha",
    price: 55,
    image: "https://images.unsplash.com/photo-1562440499-64e4f3d8e55b?auto=format&fit=crop&w=500&q=60",
    description: "Chocolate-flavored coffee with a rich and creamy taste.",
    rating: 4.3,
    prepTime: "6 min",
  },
  {
    id: 5,
    name: "Espresso",
    price: 35,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=60",
    description: "Strong and bold espresso shot made from high-quality beans.",
    rating: 4.6,
    prepTime: "3 min",
  },
];

export { products };

const ProductList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
