import { useTheme } from '../context/ThemeContext';

const CustomerReview = () => {
  const { theme } = useTheme();
  const reviewText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit...";

  return (
    <section className={`py-16 px-6 transition-colors duration-300 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
      <div className="container mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-12 ${theme === "dark" ? "text-amber-300" : "text-gray-800"}`}>CUSTOMER'S REVIEW</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map((item) => (
            <div key={item} className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`}>
              <p className="mb-4">{reviewText}</p>
              <p className="mb-4">{reviewText}</p>
              <p>{reviewText}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReview;
