import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "18B Lawyer",
  description: "Operating System for Court-Appointed Attorneys",
  keywords: ["legal", "attorney", "court-appointed", "case management", "public defender"],
  authors: [{ name: "18B Lawyer" }],
  robots: "noindex, nofollow", // Private app - don't index
  
  // Open Graph for link previews
  openGraph: {
    title: "18B Lawyer",
    description: "Operating System for Court-Appointed Attorneys",
    type: "website",
    siteName: "18B Lawyer",
  },
  
  // Apple web app settings
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "18B Lawyer",
  },
  
  // Prevent phone number detection on iOS
  formatDetection: {
    telephone: false,
  },
};

// Mobile viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#001a33" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://apis.google.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Inter font */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body 
        className="antialiased"
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        <AuthProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
