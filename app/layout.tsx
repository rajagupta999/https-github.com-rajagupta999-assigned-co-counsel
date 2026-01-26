import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "AssignedCoCounsel.com",
  description: "Operating System for Court-Appointed Attorneys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
