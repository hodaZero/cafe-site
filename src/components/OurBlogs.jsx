import { useTheme } from '../context/ThemeContext';

const OurBlogs = () => {
  const { theme } = useTheme();
  const blogs = [
    { id:1, title:"Tasty & Refreshing Coffee", author:"John", date:"3rd March, 2024", excerpt:"Ionen ipsum dolor sit amet elit..." },
    { id:2, title:"Tasty & Refreshing Coffee", author:"John", date:"3rd March, 2024", excerpt:"Ionen ipsum dolor sit amet elit..." },
    { id:3, title:"Tasty & Refreshing Coffee", author:"John", date:"3rd March, 2024", excerpt:"Ionen ipsum dolor sit amet elit..." },
  ];

  return (
    <section className={`py-16 px-6 transition-colors duration-300 ${theme === "dark" ? "bg-dark-background" : "bg-light-background"}`}>
      <div className="container mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-12 ${theme === "dark" ? "text-dark-text" : "text-light-text"}`}>OUR 
          <span className={theme === "dark" ? "text-dark-primary" : "text-light-primary"}> BLOGS </span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div key={blog.id} className={`rounded-lg overflow-hidden shadow-lg transition-colors duration-300 ${theme === "dark" ? "bg-dark-surface text-dark-text" : "bg-light-surface text-light-text"}`}>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm mb-4 opacity-75">By {blog.author} / {blog.date}</p>
                <p className="mb-6">{blog.excerpt}</p>
                <button className={ `
    py-2 px-4
    rounded
    transition-colors duration-300
    ${theme === "light" 
      ? "bg-light-primary hover:bg-light-primaryHover text-light-text" 
      : "bg-dark-primary hover:bg-dark-primaryHover text-dark-text"}
  `}>Get in Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurBlogs;
