module.exports = {
  darkMode: "class", // ممكن تفعل الدارك لما تحط "dark" على html/body
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#FFF8F1",    // بيج دافيء
          surface: "#FFFFFF",       // أبيض نظيف
          text: "#2C2C2C",          // رمادي غامق للقراية
          heading: "#8B4513",       // بني قهوة للـ headings
          input: "#FFF5E6",          // خلفية فاتحة للـ input
          inputBorder: "#E5CDA7",    // إطار فاتح دافيء
          primary: "#D97706",        // برتقالي دافيء للمكونات الأساسية
          primaryHover: "#B45309",  // نفس اللون بس أغمق شوية عند hover
        },

        dark: {
          background: "#1C1C1E",    // غامق مودرن
          surface: "#2A2A2E",       // أسود رمادي للسطح
          text: "#EDEDED",          // أبيض فاتح للنصوص
          heading: "#F59E0B",       // أصفر دافيء للـ headings
          input: "#38383C",          // خلفية input غامقة
          inputBorder: "#52525B",    // إطار input غامق شوية
          primary: "#D97706",        // برتقالي دافيء للمكونات الأساسية
          primaryHover: "#B45309",  // hover أغمق
        },
      },
    },
  },
  plugins: [],
};
