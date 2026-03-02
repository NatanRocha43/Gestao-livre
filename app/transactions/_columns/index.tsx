"use client";

import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/type-badge";
import { Button } from "@/app/_components/ui/button";
import { TrashIcon } from "lucide-react";
import { useState } from "react"; // 1. Importamos o useState
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
} from "@/app/_constants/transactions";
import EditTransactionButton from "../_components/edit-transaction-button";
import { deleteTransaction } from "../_components/delete-transaction";

// 2. CRIAMOS UM MINI-COMPONENTE SÓ PARA AS AÇÕES
// Isso permite que cada linha tenha seu próprio estado de "Modal Aberto/Fechado"
const ActionCell = ({ transaction }: { transaction: Transaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    await deleteTransaction(transaction.id);
    setIsModalOpen(false); // Fecha o modal depois de deletar
  };

  return (
    <div className="space-x-1">
      <EditTransactionButton transaction={transaction} />

      {/* Botão da Lixeira que apenas abre o modal */}
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() => setIsModalOpen(true)}
      >
        <TrashIcon />
      </Button>

      {/* 3. O MODAL FEITO 100% NA MÃO COM TAILWIND */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          {/* Caixa do Modal */}
          <div className="w-full max-w-md rounded-lg border border-solid border-border bg-background p-6 shadow-lg">
            <h2 className="text-lg font-bold">Você tem certeza absoluta?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Essa ação não pode ser desfeita. A transação será excluída
              permanentemente do seu histórico.
            </p>

            {/* Botões do Modal */}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)} // Apenas fecha o modal
              >
                Cancelar
              </Button>
              <Button
                variant="destructive" // Deixa o botão vermelho (padrão do shadcn)
                onClick={handleDelete} // Executa a exclusão real
              >
                Sim, excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. A SUAS COLUNAS CONTINUAM NORMAIS
export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: "Descrição",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
    ),
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_CATEGORY_LABELS[transaction.category],
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de Pagamento",
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod],
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row: { original: transaction } }) =>
      new Date(transaction.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row: { original: transaction } }) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(transaction.amount)),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: transaction } }) => {
      // Usamos o nosso mini-componente aqui!
      return <ActionCell transaction={transaction} />;
    },
  },
];