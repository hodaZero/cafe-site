// import { useTheme } from "../context/ThemeContext";
// import { motion } from "framer-motion";
// import Hero from "../components/Hero";
// import MenuSection from "../components/MenuSection";
// import CustomerReview from "../components/CustomeReviews";
// import ContactUs from "../components/ContactUs";
// import OurBlogs from "../components/OurBlogs";

// const Home = () => {
//   const { theme } = useTheme();

//   const sections = [
//     { Component: Hero },
//     { Component: MenuSection },
//     { Component: CustomerReview },
//     { Component: ContactUs },
//     { Component: OurBlogs },
//   ];

//   return (
//     <div className={`pt-16${theme === "light" ? "bg-light-background text-light-text" : "bg-dark-background text-dark-text"}`}>
//       {sections.map(({ Component }, index) => (
//         <motion.div
//           key={index}
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: false, amount: 0.1 }}
//           transition={{ duration: 0.6, delay: index * 0.2 }}
//           className="flex flex-col"
//         >
//           <Component theme={theme} />
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default Home;



import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import MenuSection from "../components/MenuSection";
import CustomerReview from "../components/CustomeReviews";
import ContactUs from "../components/ContactUs";
import OurBlogs from "../components/OurBlogs";
import SmartRecommendations from "../components/SmartRecommendations"; 


const Home = () => {
  const { theme } = useTheme();

  const sections = [
    { Component: Hero },
    { Component: SmartRecommendations }, // ⭐ هنا حطينا الريكومينديشن
    { Component: MenuSection },
    { Component: CustomerReview },
    { Component: ContactUs },
    { Component: OurBlogs },
  ];

  return (
    <div
      className={`pt-16 ${
        theme === "light"
          ? "bg-light-background text-light-text"
          : "bg-dark-background text-dark-text"
      }`}
    >
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
