"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="relative flex items-center justify-between border-b border-solid bg-background px-6 py-4 lg:px-8">
      <div className="flex items-center gap-10">
        <Image src="/logo.svg" width={173} height={39} alt="Finance AI" />
        
        {/* Links visíveis apenas em Desktop (1024px+) */}
        <div className="hidden lg:flex items-center gap-10">
          <Link
            href="/"
            className={pathname === "/" ? "font-bold text-primary" : "text-muted-foreground"}
          >
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className={pathname === "/transactions" ? "font-bold text-primary" : "text-muted-foreground"}
          >
            Transações
          </Link>
          <Link
            href="/subscription"
            className={pathname === "/subscription" ? "font-bold text-primary" : "text-muted-foreground"}
          >
            Assinatura
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:block">
          <UserButton showName />
        </div>
        <div className="block lg:hidden">
          <UserButton />
        </div>

        {/* Botão de Hambúrguer (até 1023px) */}
        <button 
          onClick={toggleMenu} 
          className="block lg:hidden p-2 text-muted-foreground transition-colors hover:text-primary"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu Mobile com Animação */}
      <div 
        className={`absolute left-0 top-full z-50 flex w-full flex-col items-center gap-6 border-b border-solid bg-background pb-6 pt-4 shadow-lg transition-all duration-300 ease-in-out lg:hidden ${
          isMenuOpen 
            ? "visible translate-y-0 opacity-100" 
            : "invisible -translate-y-4 opacity-0"
        }`}
      >
        <Link href="/" onClick={toggleMenu} className={pathname === "/" ? "font-bold text-primary text-lg" : "text-muted-foreground text-lg"}>
          Dashboard
        </Link>
        <Link href="/transactions" onClick={toggleMenu} className={pathname === "/transactions" ? "font-bold text-primary text-lg" : "text-muted-foreground text-lg"}>
          Transações
        </Link>
        <Link href="/subscription" onClick={toggleMenu} className={pathname === "/subscription" ? "font-bold text-primary text-lg" : "text-muted-foreground text-lg"}>
          Assinatura
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;