import type { Metadata } from "next";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "VidyaVani | Madhav Institute of Technology & Science (MITS), Gwalior",
  description:
    "Madhav Institute of Technology & Science (MITS), Gwalior is a government-aided, UGC-autonomous institute offering undergraduate, postgraduate and doctoral programs in engineering, architecture and management. NAAC accredited with active research, placements and student initiatives.",
  keywords: [
    "MITS Gwalior",
    "Madhav Institute of Technology and Science",
    "engineering college Gwalior",
    "UGC autonomous engineering college",
    "NAAC accredited engineering college",
    "RGPV affiliated institute",
    "engineering admissions MP"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${outfit.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
