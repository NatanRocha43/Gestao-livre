"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteTransaction = async (transactionId: string) => {
  await db.transaction.delete({
    where: {
      id: transactionId,
    },
  });

  // Isso aqui faz a linha sumir da tabela na mesma hora sem precisar dar F5
  revalidatePath("/transactions");
  revalidatePath("/");
};