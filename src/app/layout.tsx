import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsLetter from "@/components/NewsLetter";
import { ScrollLockProvider } from "@/LockContext/LockContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shopify-demo-custom-storefront",
  description: "A custom storefront for a shopify store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ScrollLockProvider>
          <Navbar />
          {children}
          <NewsLetter />
          <Footer />
        </ScrollLockProvider>
      </body>
    </html>
  );
}
