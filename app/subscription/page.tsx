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
    <div className="p-6 pb-20 space-y-6">
      <div className="mx-auto mb-12 flex max-w-[800px] flex-col items-center justify-center pt-8 text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {hasPremiumPlan ? "Você é um usuário Premium!" : "Faça o upgrade das suas finanças"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {hasPremiumPlan 
            ? "Sua assinatura está ativa. Aproveite as transações ilimitadas ao lado da poderosa Inteligência Artificial." 
            : "Desbloqueie o poder da Inteligência Artificial e tenha o controle total sobre a gestão do seu patrimônio com relatórios avançados."}
        </p>
      </div>
      
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch">
        
        {/* PLANO BÁSICO */}
        <Card className="w-full lg:w-[450px] relative border-border flex flex-col">
          <CardHeader className="flex flex-col items-center border-b border-solid py-8 gap-4 relative">
            {!hasPremiumPlan && (
              <Badge className="bg-muted text-muted-foreground hover:bg-muted">
                Seu Plano Atual
              </Badge>
            )}
            <h2 className="text-2xl font-semibold">Plano Básico</h2>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold">R$</span>
              <span className="text-6xl font-bold">0</span>
              <span className="text-xl text-muted-foreground">/Mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 py-8 flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <CheckIcon className="text-primary" />
              <p>
                Apenas 10 transações por mês ({currentMonthTransactions}/10)
              </p>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <XIcon className="h-4 w-4" />
              <p>Relatório de Inteligência Artificial</p>
            </div>
          </CardContent>
        </Card>

        {/* PLANO PREMIUM */}
        <Card className="w-full lg:w-[450px] relative border-primary border-2 shadow-2xl shadow-primary/20 flex flex-col overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          
          <CardHeader className="flex flex-col items-center border-b border-solid py-8 gap-4 relative z-10">
            {hasPremiumPlan ? (
              <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                Assinatura Ativa
              </Badge>
            ) : (
              <Badge className="bg-primary text-primary-foreground hover:bg-primary animate-pulse shadow-md shadow-primary/30">
                💡 Recomendado
              </Badge>
            )}
            <h2 className="text-2xl font-semibold text-primary">Finance AI Premium</h2>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold">R$</span>
              <span className="text-6xl font-bold">19</span>
              <span className="text-xl text-muted-foreground">/Mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 py-8 flex flex-col justify-between flex-1 relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-2 font-medium">
                <CheckIcon className="text-primary" />
                <p>Transações totalmente ilimitadas</p>
              </div>
              <div className="flex items-center gap-3 font-medium">
                <CheckIcon className="text-primary" />
                <p>Relatório completo com IA (Gemini)</p>
              </div>
            </div>
            <div className="mt-8 pt-4">
              <AcquirePlanButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;