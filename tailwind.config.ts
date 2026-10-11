import type { Config } from "tailwindcss";

// Tokens mirror MASTER.md / src/index.css
export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Segoe UI"', "Roboto", "system-ui", "sans-serif"],
        display: ['"IM Fell English"', '"Iowan Old Style"', "Georgia", "serif"],
        script: ['"Pinyon Script"', '"Snell Roundhand"', "cursive"],
      },
      fontSize: {
        display: ["clamp(2.6rem, 6vw, 4.75rem)", { lineHeight: "1.02" }],
        h2: ["clamp(2.1rem, 4.2vw, 3.25rem)", { lineHeight: "1.08" }],
        name: ["clamp(4.5rem, 11vw, 9rem)", { lineHeight: "0.9" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        rose: "hsl(var(--rose))",
        blush: {
          DEFAULT: "hsl(var(--blush))",
          2: "hsl(var(--blush-2))",
        },
        petal: "hsl(var(--petal))",
        milk: "hsl(var(--milk))",
        ink: "hsl(var(--ink))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        window: "2.5rem",
        card: "1.75rem",
        widget: "1.375rem",
        img: "1.125rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 6px)",
        sm: "calc(var(--radius) - 10px)",
      },
      boxShadow: {
        soft: "0 1px 0 rgba(255,255,255,.9) inset, 0 12px 32px -16px rgba(184,54,90,.28)",
        lift: "0 1px 0 rgba(255,255,255,.9) inset, 0 22px 44px -18px rgba(184,54,90,.38)",
        window: "0 40px 90px -40px rgba(184,54,90,.40), 0 2px 0 rgba(255,255,255,.9) inset",
      },
      transitionDuration: {
        fast: "180ms",
        base: "320ms",
        slow: "640ms",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
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
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
