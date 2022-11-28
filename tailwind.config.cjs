/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    themes: ["fantasy"],
    darkTheme: "light",
  },
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
      },
    },
  },
  plugins: [
    require("daisyui"),
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    }
  ],
};
