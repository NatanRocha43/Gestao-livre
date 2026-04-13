"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isMatch } from "date-fns";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/app/_constants/transactions";

export const generateAiReport = async (month: string) => {
  // 1. Validação
  if (!isMatch(month, "MM")) {
    throw new Error("Mês inválido. Use o formato MM (ex: 03)");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  // 2. Buscar usuário
  const user = await clerkClient().users.getUser(userId);
  const userHasPremiumPlan =
    user.publicMetadata.subscriptionPlan === "premium";

  if (!userHasPremiumPlan) {
    throw new Error(
      "Apenas usuários Premium podem gerar relatórios com IA."
    );
  }

  const firstName = user.firstName || "usuário";

  // 3. Configuração Gemini
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY não configurada.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const systemInstruction = `Você é um consultor financeiro pessoal de elite, focado em ajudar indivíduos a organizar as finanças, otimizar orçamento e multiplicar investimentos.
Sua análise deve ser cirúrgica, debruçada sobre os números fornecidos e orientada para resultados práticos. Abandone dicas genéricas e foque nos hábitos reais do usuário.

REGRAS OBRIGATÓRIAS:
- Formatação em MARKDOWN rica e amigável (use negritos, itálicos e separadores visuais).
- Obedeça EXATAMENTE os títulos e a ordem exigidos no prompt (nada a mais, nada a menos).
- PROIBIDO o uso de emojis. Mantenha a interface limpa e sobriedade técnica.
- Priorize a leitura dinâmica: apoie-se fortemente em bullet points.
- O tom da conversa deve ser direto, motivador, empático, mas profundamente realista (se a pessoa estiver gastando demais em supérfluos, alerte!).
- Resposta fluida 100% em português do Brasil (PT-BR).`;

  // 4. Buscar transações
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  if (transactions.length === 0) {
    return "Você ainda não possui transações registradas para este mês.";
  }

  // 5. Preparar dados
  const transactionsData = transactions
    .map((t) => {
      const tipo =
        TRANSACTION_TYPE_OPTIONS.find((opt) => opt.value === t.type)
          ?.label || t.type;

      const categoria =
        TRANSACTION_CATEGORY_LABELS[t.category] || t.category;

      const metodoPagamento =
        TRANSACTION_PAYMENT_METHOD_LABELS[t.paymentMethod] ||
        t.paymentMethod;

      return `${t.date.toLocaleDateString(
        "pt-BR"
      )} | R$${t.amount} | Tipo: ${tipo} | Categoria: ${categoria} | Pagamento: ${metodoPagamento}`;
    })
    .join("\n");

  const content = `Olá, meu nome é ${firstName}. Aqui estão as minhas transações deste mês:

${transactionsData}

Por favor, crie um relatório financeiro com a seguinte estrutura exata:

### Resumo Executivo
(Faça um balanço direto do mês categorizando o cenário como Positivo, Alerta ou Crítico. Compare o volume de Receitas vs Despesas (entradas x saídas), e conclua se fechamos o mês no verde ou se a pessoa está queimando caixa).

### Análise de Hábitos de Consumo
(Descreva como e onde o dinheiro foi gasto. Agrupe as informações de forma perspicaz usando bullet points. Identifique a "maior despesa" e aponte eventuais exageros em categorias específicas como Alimentação, Transporte, Lazer, etc. Demonstre atenção aos detalhes dos dados fornecidos).

### Plano Estratégico e Recomendações
(Baseado ESTRITAMENTE nos dados reais apresentados, forneça exatamente 3 diretrizes financeiras práticas e altamente personalizadas para o próximo mês. Proibido conselhos genéricos. Aponte exatamente o que deve mudar no comportamento do usuário face ao seu histórico de gastos).

### Considerações Finais
(1 parágrafo curto encerrando a análise de forma madura e construtiva, e dirigindo-se diretamente a mim pelo meu nome).`;

  // 6. Modelos atualizados com base na disponibilidade da conta
  const recoveryModels = [
    "gemini-3.1-flash-lite-preview",
    "gemini-flash-latest", // Alias de segurança
    "gemini-2.5-pro", // Última pro
    "gemini-2.5-flash", // Modelo rápido padrão
  ];

  for (const modelName of recoveryModels) {
    try {
      console.log(`Tentando modelo: ${modelName}...`);

      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });

      const result = await model.generateContent(content);
      const text = result.response.text();

      if (text) {
        console.log(`✅ Relatório gerado com SUCESSO pelo modelo: ${modelName}`);
        return text;
      }
    } catch (error) {
      const err = error as Error;
      console.warn(
        `⚠️ Erro no modelo ${modelName}:`,
        err?.message || "Serviço indisponível ou limite alcançado"
      );
    }
  }

  throw new Error(
    "Não foi possível gerar o relatório no momento. Tente novamente mais tarde."
  );
};