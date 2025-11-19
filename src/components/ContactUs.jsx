import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const ContactUs = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({name:'', email:'', mobile:''});

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  const handleSubmit = (e) => { e.preventDefault(); console.log(formData); alert('Form submitted!'); }

  return (
    <section className={`py-16 px-6 transition-colors duration-300 ${theme === "dark" ? "bg-dark-background" : "bg-light-background"}`}>
      <div className="container mx-auto max-w-4xl">
        <h2 className={`text-3xl font-bold text-center mb-12 ${theme === "dark" ? "text-dark-primary" : "text-light-primary"}`}>CONTACT US</h2>
        <div className={`p-8 rounded-lg shadow-lg transition-colors duration-300 ${theme === "dark" ? "bg-dark-surface text-dark-text" : "bg-light-surface text-light-text"}`}>
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
                  className={`w-full p-3 rounded-lg border transition-colors duration-300 ${theme === "dark" ? "bg-dark-input border-dark-inputBorder text-dark-text" : "bg-light-input border-light-inputBorder text-light-text"}`}
                />
              </div>
            ))}
            <button className={` w-full 
    py-3 px-6 
    rounded-lg 
    font-semibold 
    transition-colors duration-300 
    ${theme === "light" 
      ? "bg-light-primary hover:bg-light-primaryHover text-light-text" 
      : "bg-dark-primary hover:bg-dark-primaryHover text-dark-text"}
    `}>Contact Now</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
