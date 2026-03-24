import { db } from "../_lib/prisma";
import { TypeFilterTable } from "./_components/type-filter-table";
import AddTransactionButton from "../_components/add-transaction-button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import { PrivacyToggleButton } from "../_components/privacy-toggle-button";

const TransactionsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const transactions = await db.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });
  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <>
      <ScrollArea>
        <div className="space-y-6 overflow-hidden p-6">
          
          {/* TÍTULO E BOTÃO COM LAYOUT RESPONSIVO REFEITO */}
          <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
            <div className="flex items-center gap-3">
              
              <h1 className="text-2xl font-bold text-center lg:text-left">Transações</h1>
              <PrivacyToggleButton />
            </div>
            <div className="flex w-full justify-center lg:w-auto lg:justify-end">
              <AddTransactionButton
                userCanAddTransaction={userCanAddTransaction}
              />
            </div>
          </div>
          
          {/* Tabela Interativa de Filtros Dinâmicos */}
          <TypeFilterTable transactions={transactions} />
        </div>
      </ScrollArea>
    </>
  );
};

export default TransactionsPage;