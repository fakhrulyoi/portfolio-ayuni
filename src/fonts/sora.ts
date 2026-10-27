import localFont from "next/font/local";

// Self-hosted Sora (Orbit template display face). next/font adds a
// size-adjusted fallback so the headline doesn't jump when it loads.
export const sora = localFont({
  src: "./sora-latin.woff2",
  weight: "100 800",
  variable: "--font-sora",
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
