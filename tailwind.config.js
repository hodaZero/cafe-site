module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#F7F7F7",    
          surface: "#FFFFFF",        
          text: "#1A1A1A",          
          heading: "#2C2C2C",       
          input: "#FFFFFF",
          inputBorder: "#D1D5DB",    
          primary: "#B45309",        
          primaryHover: "#92400E", 
        },

        dark: {
          background: "#0F0F12",    
          surface: "#1A1A1E",        
          text: "#E5E5E5",
          heading: "#FACC15",       
          input: "#2A2A2E",          
          inputBorder: "#3F3F46",    
          primary: "#B45309",        
          primaryHover: "#D97706",  
        },
      },
    },
  },
  plugins: [],
};
