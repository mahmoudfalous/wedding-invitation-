// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ForeverInvites | Romantic Digital Wedding Invitations",
  description: "Create a beautiful, cinematic digital space for your wedding in seconds. No registration required.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable} h-full antialiased`}>
    <body className="min-h-full font-body">{children}</body>
    </html>
  );
}