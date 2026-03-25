import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { auth } from "@clerk/nextjs/server";

export const getDashboard = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  // Captura o ano atual dinamicamente
  const currentYear = new Date().getFullYear();
  
  // Define o intervalo de busca: do primeiro dia do mês até o primeiro dia do próximo mês
  const startDate = new Date(`${currentYear}-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  const where = {
    userId,
    date: {
      gte: startDate,
      lt: endDate,
    },
  };
  
  // Adicionado o '|| 0' ao final para garantir que retorne 0 ao invés de null/undefined
  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  );
  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  );
  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  );
  
  const balance = depositsTotal - investmentsTotal - expensesTotal;
  
  const transactionsTotal = Number(
    (
      await db.transaction.aggregate({
        where,
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  );

  // CORREÇÃO DO NaN: Condição para evitar a divisão por zero
  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]: transactionsTotal > 0 
      ? Math.round((depositsTotal / transactionsTotal) * 100) 
      : 0,
    [TransactionType.EXPENSE]: transactionsTotal > 0 
      ? Math.round((expensesTotal / transactionsTotal) * 100) 
      : 0,
    [TransactionType.INVESTMENT]: transactionsTotal > 0 
      ? Math.round((investmentsTotal / transactionsTotal) * 100) 
      : 0,
  };

  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ["category"],
      where: {
        ...where,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
  ).map((category) => {
    const amount = Number(category._sum.amount || 0);
    return {
      category: category.category,
      totalAmount: amount,
      // CORREÇÃO DO NaN: Condição para evitar divisão por zero nas categorias
      percentageOfTotal: expensesTotal > 0 
        ? Math.round((amount / expensesTotal) * 100) 
        : 0,
    };
  });

  const lastTransactions = await db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 15,
  });

  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions: JSON.parse(JSON.stringify(lastTransactions)),
  };
};