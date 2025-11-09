import React from "react";
import ProductList from "../components/ProductList"; 

const Menu = () => {
  return (
    <div className="bg-black min-h-screen px-6 md:px-16 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-white pt-10">
        OUR <span className="text-[#d3ad7f]">MENU</span>
      </h1>
      <ProductList />
    </div>
  );
};

export default Menu;
