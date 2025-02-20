import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Turing AI",
  description: "Turing AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
          
            <header className="bg-gray-100 "></header>
            <main className="flex-grow">{children}</main>
            <footer className="bg-gray-100 mt-auto"></footer>
        </body>
    </html>
  );
}
