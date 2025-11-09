import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const ContactUs = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({name:'', email:'', mobile:''});

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  const handleSubmit = (e) => { e.preventDefault(); console.log(formData); alert('Form submitted!'); }

  return (
    <section className={`py-16 px-6 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="container mx-auto max-w-4xl">
        <h2 className={`text-3xl font-bold text-center mb-12 ${theme === "dark" ? "text-amber-300" : "text-gray-800"}`}>CONTACT US</h2>
        <div className={`p-8 rounded-lg shadow-lg transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-800"}`}>
          <h3 className="text-2xl font-semibold mb-6">GET IN TOUCH</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {["name","email","mobile"].map(field => (
              <div key={field}>
                <label htmlFor={field} className="block mb-2 font-medium">{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                <input
                  type={field==="email"?"email":field==="mobile"?"tel":"text"}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 rounded-lg border transition-colors duration-300 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-800"}`}
                />
              </div>
            ))}
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300">Contact Now</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
