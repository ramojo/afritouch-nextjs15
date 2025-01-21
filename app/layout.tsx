import type { Metadata } from "next";
import localFont from "next/font/local";
// import Image from "next/image";
import "./globals.css";
// import logo from '@/public/images/afritouch_logo_transparent.png';
import Nav from "@/app/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import PackagesComponent from "@/app/components/packages-component"; // Ensure this path is correct

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Afritouch Caterers",
  description: "Delicious Food for Every Occasion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <header className="flex items-center p-4 bg-yellow-500">
          <Image src={logo} alt="Afritouch Logo" width={150} height={50} className="object-contain" />
        </header> */}
          <Nav />
          {/* <PackagesComponent /> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
