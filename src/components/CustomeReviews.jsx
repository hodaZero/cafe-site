import { useTheme } from '../context/ThemeContext';

const CustomerReview = () => {
  const { theme } = useTheme();
  const reviewText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit...";

  return (
    <section className={`py-16 px-6 transition-colors duration-300 ${theme === "dark" ? "bg-dark-background" : "bg-light-background"}`}>
      <div className="container mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-12 ${theme === "dark" ? "text-dark-text" : "text-light-text"}`}>CUSTOMER'S 
          
          <span className={theme === "dark" ? "text-dark-primary" : "text-light-primary"}> REVIEW</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map((item) => (
            <div key={item} className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${theme === "dark" ? "bg-dark-surface text-light-surface" : "bg-dark-text text-light-heading"}`}>
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
