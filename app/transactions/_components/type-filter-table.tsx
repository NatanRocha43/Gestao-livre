"use client";

import { useState } from "react";
import { Transaction, TransactionType } from "@prisma/client";
import { DataTable } from "@/app/_components/ui/data-table";
import { transactionColumns } from "../_columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

interface TypeFilterTableProps {
  transactions: Transaction[];
}

export const TypeFilterTable = ({ transactions }: TypeFilterTableProps) => {
  const [filterType, setFilterType] = useState<TransactionType | "ALL">("ALL");

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "ALL") return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-6">
      <div className="flex w-full sm:w-auto sm:justify-start">
        <Select
          onValueChange={(value) => setFilterType(value as TransactionType | "ALL")}
          defaultValue={filterType}
        >
          <SelectTrigger className="w-full sm:w-[200px] rounded-full font-bold">
            <SelectValue placeholder="Tipo de transação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Mostrar Todas</SelectItem>
            <SelectItem value={TransactionType.DEPOSIT}>Receitas</SelectItem>
            <SelectItem value={TransactionType.EXPENSE}>Despesas</SelectItem>
            <SelectItem value={TransactionType.INVESTMENT}>Investimentos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={transactionColumns} data={filteredTransactions} />
    </div>
  );
};
