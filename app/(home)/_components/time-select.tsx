"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MONTH_OPTIONS = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const TimeSelect = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  
  // Estados para controlar a hidratação e o mês selecionado
  const [isMounted, setIsMounted] = useState(false);
  const [month, setMonth] = useState("");

  useEffect(() => {
    // Isso só roda no navegador do usuário, garantindo sincronia perfeita
    setIsMounted(true);
    
    // Pega o mês da URL. Se não tiver, pega o mês atual do sistema
    const urlMonth = searchParams.get("month");
    const currentSystemMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    
    setMonth(urlMonth || currentSystemMonth);
  }, [searchParams]);

  const handleMonthChange = (selectedMonth: string) => {
    setMonth(selectedMonth); // Atualiza a tela imediatamente
    push(`/?month=${selectedMonth}`); // Atualiza a URL
  };

  // Se ainda estiver no servidor, renderiza um "botão falso" para evitar o erro de hidratação
  if (!isMounted) {
    return (
      <div className="h-10 w-full sm:w-[150px] rounded-full border border-solid bg-transparent"></div>
    );
  }

  return (
    <Select 
      onValueChange={handleMonthChange} 
      value={month}
    >
      <SelectTrigger className="w-full sm:w-[150px] rounded-full">
        {/* Agora o Shadcn vai conseguir encontrar o nome sozinho através do 'value' */}
        <SelectValue placeholder="Mês" />
      </SelectTrigger>
      <SelectContent>
        {MONTH_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeSelect;