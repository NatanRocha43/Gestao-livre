import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { PrivacyProvider } from "./_contexts/privacy-context";
import { ptBR } from "@clerk/localizations";
import { dark } from "@clerk/themes";
import Navbar from "./_components/navbar"; // 1. Importe o Navbar aqui

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestão.ai",
  description: "Seu sistema de gestão financeira",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} dark antialiased`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ClerkProvider appearance={{ baseTheme: dark }} localization={ptBR as any}>
          <PrivacyProvider>
            
            {/* 2. COLOQUE O NAVBAR AQUI */}
            <Navbar /> 
            
            {/* O children é onde o Next.js vai injetar suas páginas e o loading.tsx */}
            {children} 
            
          </PrivacyProvider>
        </ClerkProvider>

        {/* <Toaster /> */}
      </body>
    </html>
  );
}