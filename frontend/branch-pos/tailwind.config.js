/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        branch: {
          pending: '#F59E0B',
          preparing: '#3B82F6',
          ready: '#10B981',
          picked: '#6366F1',
        }
      }
    },
  },
  plugins: [],
}
