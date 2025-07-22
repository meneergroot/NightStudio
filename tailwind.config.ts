import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'solana-green': '#00FFA3',
        'solana-purple': '#DC1FFF',
        'solana-dark': '#0E0E10',
        'solana-gray': '#1A1A1A',
        'solana-light-gray': '#2A2A2A',
      },
      backgroundImage: {
        'solana-gradient': 'linear-gradient(90deg, #00FFA3 0%, #DC1FFF 100%)',
        'solana-gradient-vertical': 'linear-gradient(180deg, #00FFA3 0%, #DC1FFF 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00FFA3, 0 0 10px #00FFA3, 0 0 15px #00FFA3' },
          '100%': { boxShadow: '0 0 10px #00FFA3, 0 0 20px #00FFA3, 0 0 30px #00FFA3' },
        },
      },
    },
  },
  plugins: [],
};

export default config; 