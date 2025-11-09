import { useTheme } from '../context/ThemeContext';

const OurBlogs = () => {
  const { theme } = useTheme();
  const blogs = [
    { id:1, title:"Tasty & Refreshing Coffee", author:"John", date:"3rd March, 2024", excerpt:"Ionen ipsum dolor sit amet elit..." },
    { id:2, title:"Tasty & Refreshing Coffee", author:"John", date:"3rd March, 2024", excerpt:"Ionen ipsum dolor sit amet elit..." },
    { id:3, title:"Tasty & Refreshing Coffee", author:"John", date:"3rd March, 2024", excerpt:"Ionen ipsum dolor sit amet elit..." },
  ];

  return (
    <section className={`py-16 px-6 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="container mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-12 ${theme === "dark" ? "text-amber-300" : "text-gray-800"}`}>OUR BLOGS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div key={blog.id} className={`rounded-lg overflow-hidden shadow-lg transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-800"}`}>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm mb-4 opacity-75">By {blog.author} / {blog.date}</p>
                <p className="mb-6">{blog.excerpt}</p>
                <button className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded transition-colors duration-300">Get in Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurBlogs;
