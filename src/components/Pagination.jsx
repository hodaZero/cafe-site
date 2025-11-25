import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const { theme } = useTheme();
  const btnBase = "w-10 h-10 flex items-center justify-center mx-1 rounded-full font-semibold transition-colors duration-300 cursor-pointer";

  const activeClass = theme === "light"
    ? "bg-light-primary text-black"
    : "bg-dark-primary text-black";

  const inactiveClass = theme === "light"
    ? "bg-light-surface text-light-text hover:bg-light-primaryHover hover:text-black"
    : "bg-dark-surface text-dark-text hover:bg-dark-primaryHover hover:text-black";

  return (
    <div className="flex justify-center items-center mt-6 gap-2">
      {/* Previous */}
      <div
        className={`${btnBase} ${currentPage === 1 ? inactiveClass + " opacity-50 cursor-not-allowed" : inactiveClass}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >
        &lt;
      </div>

      {/* Current Page in Circle */}
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-light-primary dark:bg-light-primary text-white font-bold">
        {currentPage}
      </div>

      {/* Next */}
      <div
        className={`${btnBase} ${currentPage === totalPages ? inactiveClass + " opacity-50 cursor-not-allowed" : inactiveClass}`}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      >
        &gt;
      </div>
    </div>
  );
}
