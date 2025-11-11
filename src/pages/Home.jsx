import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import MenuSection from "../components/MenuSection";
import CustomerReview from "../components/CustomeReviews";
import ContactUs from "../components/ContactUs";
import OurBlogs from "../components/OurBlogs";

const Home = () => {
  const { theme, toggleTheme } = useTheme();

  const sections = [
    { Component: Hero },
    { Component: MenuSection },
    { Component: CustomerReview },
    { Component: ContactUs },
    { Component: OurBlogs },
  ];

  return (
    <div className={theme === "light" ? "bg-white text-black" : "bg-dark text-white"}>
      <button
        onClick={toggleTheme}
        className="p-2 m-4 border border-primary rounded-md text-primary hover:bg-primary/10 transition"
      >
        Toggle Theme
      </button>

      {sections.map(({ Component }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className="flex flex-col"
        >
          <Component theme={theme} />
        </motion.div>
      ))}
    </div>
  );
};

export default Home;
