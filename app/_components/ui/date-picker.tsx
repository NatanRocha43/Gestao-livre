"use client";

import * as React from "react";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/app/_lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { SelectSingleEventHandler } from "react-day-picker";

interface DatePickerProps {
  value?: Date;
  onChange?: SelectSingleEventHandler;
}

export const DatePicker = ({ value, onChange }: DatePickerProps) => {
  // 1. Criamos um estado para controlar manualmente se o Popover está aberto ou fechado
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    // 2. Passamos o estado para o Popover usando open e onOpenChange
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            new Date(value).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          ) : (
            <span>Selecione uma data...</span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-auto p-0 z-[9999]">
        <Calendar
          mode="single"
          selected={value}
          // 3. Interceptamos o evento de seleção para fechar o Popover
          onSelect={(date, selectedDay, activeModifiers, e) => {
            // Executa a função onChange original (se ela foi passada)
            if (onChange) {
              onChange(date, selectedDay, activeModifiers, e);
            }
            // Fecha o calendário!
            setIsOpen(false);
          }}
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
};