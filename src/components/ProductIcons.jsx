import React from "react";
import { Heart, ShoppingCart } from "lucide-react";

const ProductIcons = () => {
  return (
    <>
      <button className="text-[#d3ad7f] hover:text-white transition-colors">
        <Heart size={22} />
      </button>
      <button className="text-[#d3ad7f] hover:text-white transition-colors">
        <ShoppingCart size={22} />
      </button>
    </>
  );
};

export default ProductIcons;
