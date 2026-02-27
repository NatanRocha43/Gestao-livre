import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "../_components/ui/card";
import { CheckIcon, XIcon } from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";
import { Badge } from "../_components/ui/badge";
import { getCurrentMonthTransactions } from "../_data/get-current-month-transactions";

const SubscriptionPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const user = await clerkClient().users.getUser(userId);
  const currentMonthTransactions = await getCurrentMonthTransactions();
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan == "premium";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Assinatura</h1>
      
      <div className="flex flex-col gap-6 lg:flex-row">
        
        {/* PLANO BÁSICO */}
        <Card className="w-full lg:max-w-[450px]">
          <CardHeader className="flex flex-col items-center border-b border-solid py-8 gap-4">
            {/* Tiramos o absolute para o Badge não atropelar o texto */}
            {!hasPremiumPlan && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                Ativo
              </Badge>
            )}
            <h2 className="text-2xl font-semibold">Plano básico</h2>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold">R$</span>
              <span className="text-6xl font-bold">0</span>
              <span className="text-xl text-muted-foreground">/Mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 py-8">
            <div className="flex items-center gap-2">
              <CheckIcon className="text-primary" />
              <p>
                Apenas 10 transações por mês ({currentMonthTransactions}/10)
              </p>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <XIcon className="h-4 w-4" />
              <p>Relatório de IA</p>
            </div>
          </CardContent>
        </Card>

        {/* PLANO PREMIUM */}
        <Card className="w-full lg:max-w-[450px]">
          <CardHeader className="flex flex-col items-center border-b border-solid py-8 gap-4">
            {hasPremiumPlan && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                Ativo
              </Badge>
            )}
            <h2 className="text-2xl font-semibold">Plano Premium</h2>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold">R$</span>
              <span className="text-6xl font-bold">19</span>
              <span className="text-xl text-muted-foreground">/Mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 py-8">
            <div className="flex items-center gap-2">
              <CheckIcon className="text-primary" />
              <p>Transações ilimitadas</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckIcon className="text-primary" />
              <p>Relatório de IA</p>
            </div>
            {/* O botão agora vai se comportar bem no mobile */}
            <AcquirePlanButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;