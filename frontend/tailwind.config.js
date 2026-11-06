export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0F1117",
        surface: "#1A1D27",
        accent: "#14B8A6",
        muted: "#64748B",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "monospace"]
      },
      borderRadius: {
        DEFAULT: "8px"
      }
    }
  },
  plugins: []
};
