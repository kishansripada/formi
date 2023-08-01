/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // colors: {
    //   "soundcloud-bg-color": "#f5f5f5"
    // },
    // colors: {
    //   "michiganblue": "#00274c",
    //   'maize': '#ffcb05',
    // },
    extend: {
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
        proxima: ["proxima-nova", "sans-serif"]
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    },
  ],
};
