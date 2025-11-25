import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Goal Breaker",
  description: "Type a vague goal and get 5 actionable steps plus a complexity score. Powered by an AI assistant.",
  applicationName: "Smart Goal Breaker",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#3b0764" },
  ],
  openGraph: {
    title: "Smart Goal Breaker",
    description: "Type a vague goal and get 5 actionable steps plus a complexity score.",
    url: "https://abdifrost.vercel.app",
    siteName: "Smart Goal Breaker",
    images: [
      {
        url: "https://abdifrost.vercel.app/logo.png",
        width: 800,
        height: 600,
        alt: "Smart Goal Breaker logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
