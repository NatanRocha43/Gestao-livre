"use client";

import { Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent } from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TransactionType } from "@prisma/client";
import { TransactionPercentagePerType } from "@/app/_data/get-dashboard/types";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import PercentageItem from "./percentage-item";

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: "Investido",
    color: "#FFFFFF",
  },
  [TransactionType.DEPOSIT]: {
    label: "Receita",
    color: "#55B02E",
  },
  [TransactionType.EXPENSE]: {
    label: "Despesas",
    color: "#E93030",
  },
} satisfies ChartConfig;

interface TransactionsPieChartProps {
  typesPercentage: TransactionPercentagePerType;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
}

const TransactionsPieChart = ({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  typesPercentage,
}: TransactionsPieChartProps) => {
  const chartData = [
    { type: TransactionType.DEPOSIT, amount: depositsTotal, fill: "#55B02E" },
    { type: TransactionType.EXPENSE, amount: expensesTotal, fill: "#E93030" },
    { type: TransactionType.INVESTMENT, amount: investmentsTotal, fill: "#FFFFFF" },
  ];

  return (
    <Card className="flex flex-col p-6 lg:h-full lg:overflow-hidden">
      <CardContent className="flex-1 p-0 pb-0 flex flex-col justify-center items-center">
        
        {/* CONTAINER DO GRÁFICO: 
            - Visível no Mobile (até 1023px)
            - DISPLAY NONE entre 1024px e 1330px (lg:hidden min-[1331px]:block)
            - Visível novamente acima de 1330px
        */}
        <div className="w-full lg:hidden min-[1331px]:block">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="type"
                  innerRadius={60}
                  outerRadius={80}
                  strokeWidth={5}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* CONTAINER DOS TEXTOS:
            - Sempre visível
            - Ganha um espaçamento extra (mt-4) quando o gráfico está visível acima
        */}
        <div className="space-y-3 w-full">
          <PercentageItem
            icon={<TrendingUpIcon size={16} className="text-primary" />}
            title="Receita"
            value={typesPercentage[TransactionType.DEPOSIT]}
          />
          <PercentageItem
            icon={<TrendingDownIcon size={16} className="text-red-500" />}
            title="Despesas"
            value={typesPercentage[TransactionType.EXPENSE]}
          />
          <PercentageItem
            icon={<PiggyBankIcon size={16} />}
            title="Investido"
            value={typesPercentage[TransactionType.INVESTMENT]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsPieChart;