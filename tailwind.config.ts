import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'navbar': '#ffffff',
        'footer': '#222222',
        'card-button': '#00c57d',
        'card-button-hover': '#00b271',
        'card-button-light': '#D8FFEB',
        'card-button-light-hover': '#C9FFE4',
        'secondary-button': '#2D3E50',
        'secondary-button-hover': '#189BD8',
      },
      fontSize: {
        xs: '0.75rem',  // 12px
        sm: '0.875rem', // 14px
        base: '1rem',   // 16px used for paragraphs and text/words
        lg: '1.125rem', // 18px used for headings
        xl: '1.25rem',  // 20px
      },
      minWidth: {
        'mdtwo': '769px', // Replace 'custom-name' with the name you want, and '200px' with the desired value
      },
    },
  },
  plugins: [],
};
export default config;
