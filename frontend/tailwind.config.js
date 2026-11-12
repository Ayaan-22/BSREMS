export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#07080C",
        surface: "#10131B",
        ink: {
          950: "#05060A",
          900: "#07080C",
          800: "#0D1017",
          700: "#141824",
          600: "#1C2130"
        },
        accent: {
          DEFAULT: "#2DD4BF",
          soft: "#5EEAD4",
          deep: "#0F766E"
        },
        gold: {
          DEFAULT: "#F2C46D",
          soft: "#F8DDA4",
          deep: "#B7862F"
        },
        iris: "#8B7CF6",
        muted: "#7C8599",
        success: "#34D399",
        warning: "#FBBF24",
        error: "#F87171"
      },
      fontFamily: {
        sans: ["'Inter Tight'", "Inter", "ui-sans-serif", "system-ui"],
        display: ["'Instrument Serif'", "ui-serif", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"]
      },
      borderRadius: {
        DEFAULT: "10px",
        xl: "16px",
        "2xl": "22px",
        "3xl": "28px"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(45,212,191,.35), 0 10px 40px -10px rgba(45,212,191,.55)",
        "glow-gold": "0 0 0 1px rgba(242,196,109,.35), 0 10px 40px -10px rgba(242,196,109,.5)",
        float: "0 30px 80px -20px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.06)"
      },
      keyframes: {
        aurora: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(6%, -4%, 0) scale(1.08)" },
          "66%": { transform: "translate3d(-5%, 5%, 0) scale(.95)" }
        },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        sheen: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(18px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        ping2: { "0%": { transform: "scale(1)", opacity: ".7" }, "100%": { transform: "scale(2.6)", opacity: "0" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        dash: { to: { strokeDashoffset: "0" } }
      },
      animation: {
        aurora: "aurora 22s ease-in-out infinite",
        "aurora-slow": "aurora 34s ease-in-out infinite reverse",
        marquee: "marquee 40s linear infinite",
        float: "float 7s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out 1.5s infinite",
        sheen: "sheen 6s linear infinite",
        "fade-up": "fade-up .8s cubic-bezier(.2,.7,.2,1) both",
        ping2: "ping2 1.8s cubic-bezier(0,0,.2,1) infinite",
        "spin-slow": "spin-slow 18s linear infinite"
      }
    }
  },
  plugins: []
};
