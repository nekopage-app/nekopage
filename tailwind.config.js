/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      accent: "var(--accent)",
      "light-accent": "var(--light-accent)",
      text: "var(--text)",
      subtext: "var(--subtext)",
      overlay: "var(--overlay)",
      surface: "var(--surface)",
      base: "var(--base)",
      mantle: "var(--mantle)",
      crust: "var(--crust)"
    },
    fontFamily: {
      sans: ["General Sans", "sans-serif"]
    },
    extend: {},
  },
  plugins: [],
}
