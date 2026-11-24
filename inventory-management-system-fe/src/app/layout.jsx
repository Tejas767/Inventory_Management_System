/**
 * Root Layout — Wraps the entire application.
 *
 * - Sets up global font (Inter)
 * - Loads Material Symbols icon font
 * - Provides toast notifications
 * - Exports SEO metadata
 */

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// SEO metadata — applied to all pages
export const metadata = {
  title: {
    default: "Inventory Manager — IT Asset Management System",
    template: "%s | Inventory Manager",
  },
  description:
    "Professional inventory management system for tracking IT assets, employees, and support queries.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
