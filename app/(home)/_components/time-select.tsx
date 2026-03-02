"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Loader2Icon } from "lucide-react"; // Ajuste o caminho do seu ícone se precisar

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
  
  // 1. Hook mágico do React para controlar o carregamento de transições
  const [isPending, startTransition] = useTransition();

  const urlMonth = searchParams.get("month");
  const currentMonth = urlMonth 
    ? urlMonth.padStart(2, "0") 
    : String(new Date().getMonth() + 1).padStart(2, "0");

  const handleMonthChange = (selectedMonth: string) => {
    // 2. Envolvemos a mudança de rota no startTransition
    startTransition(() => {
      push(`/?month=${selectedMonth}`);
    });
  };

  return (
    <Select 
      onValueChange={handleMonthChange} 
      defaultValue={currentMonth} 
      key={currentMonth}
      // Opcional: Desabilita o select enquanto carrega para evitar cliques duplos
      disabled={isPending} 
    >
      <SelectTrigger className="w-full sm:w-[150px] rounded-full">
        {/* 3. Lógica visual: Mostra o spinner se estiver carregando, senão mostra o valor */}
        {isPending ? (
          <div className="flex items-center gap-2">
            <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Buscando...</span>
          </div>
        ) : (
          <SelectValue placeholder="Mês" />
        )}
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