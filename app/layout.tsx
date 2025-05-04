'use client';

import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import MainNav from "@/components/layout/MainNav";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { initAnalytics } from "@/lib/firebase";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Initialize analytics on client-side
    initAnalytics();
  }, []);
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MainNav />
          <main>{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
