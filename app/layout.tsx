import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import Providers from '@/lib/providers';
import "./globals.css";

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "MercyChat",
  description: "IBLT University Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
