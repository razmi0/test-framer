/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      colors: {
        fore: "rgb(22,23,22)",
        selected: "hsla(0,0%,100%,.05)",
        urophylia: "#0e7490",
        lupus: "#b91c1c",
        erotomania: "#166534",
        mythomania: "#fde047",
        dyslexia: "#2563eb",
        dyscalculia: "#7e22ce",
        dysgraphia: "#be185d",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = "") {
        const extractKeys = [
          "fore",
          "selected",
          "urophylia",
          "lupus",
          "erotomania",
          "mythomania",
          "dyslexia",
          "dyscalculia",
          "dysgraphia",
        ];
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          if (!extractKeys.includes(colorKey)) return vars;

          const value = colorObj[colorKey];

          const newVars =
            typeof value === "string"
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ":root": extractColorVars(theme("colors")),
      });
    },
  ],
};
