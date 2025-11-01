import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/session-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "3D Marketplace - Premium 3D Printable Models",
  description: "Discover thousands of high-quality STL files from talented designers. Perfect for 3D printing enthusiasts and professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Disable right-click
                document.addEventListener('contextmenu', e => e.preventDefault());
                
                // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
                document.addEventListener('keydown', e => {
                  if (e.keyCode === 123 || 
                    (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
                    (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
                    (e.ctrlKey && e.keyCode === 85)) {
                    e.preventDefault();
                    return false;
                  }
                });
                
                // Detect DevTools
                setInterval(() => {
                  const threshold = 160;
                  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
                  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
                  if (widthThreshold || heightThreshold) {
                    document.body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 20%;">Developer Tools Detected</h1>';
                  }
                }, 1000);
                
                // Clear console periodically
                setInterval(() => console.clear(), 2000);
              })();
            `,
          }}
        />
      </head>
      <body 
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
