import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
  userCanAddTransaction,
}: SummaryCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center gap-4">
        {icon}
        <p
          className={`${size === "small" ? "text-muted-foreground" : "text-white opacity-70"}`}
        >
          {title}
        </p>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <p
          className={`font-bold break-all sm:break-normal ${
            size === "small" 
              ? "text-2xl" 
              : "text-3xl min-[375px]:text-4xl" // Fonte um pouco menor em telas abaixo de 375px
          }`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {size === "large" && (
          <div className="w-full sm:w-auto">
            <AddTransactionButton
              userCanAddTransaction={userCanAddTransaction ?? false}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;