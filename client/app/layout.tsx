import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from './providers/ClientProviders';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bliro Meeting App",
  description: "Technical demo for Bliro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
