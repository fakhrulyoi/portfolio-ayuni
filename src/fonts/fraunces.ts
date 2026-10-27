import localFont from "next/font/local";

// Self-hosted Fraunces (Studio template display face, wght + SOFT axes).
export const fraunces = localFont({
  src: "./fraunces-latin.woff2",
  weight: "100 900",
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "ui-serif", "serif"],
});
