"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isMatch } from "date-fns";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/app/_constants/transactions"; // Ajuste este caminho se necessário

export const generateAiReport = async (month: string) => {
  // 1. Validações Iniciais
  if (!isMatch(month, "MM")) {
    throw new Error("Mês inválido. Use o formato MM (ex: 03)");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  // 2. Busca os dados do usuário no Clerk
  const user = await clerkClient().users.getUser(userId);
  const userHasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";

  if (!userHasPremiumPlan) {
    throw new Error("Apenas usuários Premium podem gerar relatórios com IA.");
  }

  // Pega o primeiro nome do usuário para personalizar o relatório
  const firstName = user.firstName || "usuário";

  // 3. Configuração do Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `Você é um analista financeiro sênior especializado em comunicação clara, visual e universal.
    Seu objetivo é analisar o fluxo de caixa do usuário e fornecer um relatório técnico, porém totalmente acessível para qualquer nível de conhecimento.
    REGRAS OBRIGATÓRIAS:
    - Use Markdown SEMPRE.
    - Estruture a resposta com os títulos exatos fornecidos no prompt (sem modificá-los).
    - PROIBIDO O USO DE EMOJIS (nenhum emoji deve aparecer no texto).
    - ESTÉTICA VISUAL: Priorize o uso intenso de bullet points (listas com marcadores) para facilitar a leitura dinâmica.
    - TEXTOS CURTOS: Não escreva textos exageradamente grandes. Use frases diretas e limite-se a parágrafos curtos.
    - LINGUAGEM: O relatório deve ser compreendido rapidamente por um leigo, mas manter a precisão técnica que um especialista espera.
    - NUNCA use termos em inglês. O relatório deve ser 100% em português do Brasil.`,
  });

  // 4. Busca as transações no Banco de Dados
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

  // 5. Preparação dos Dados (Traduzindo com as suas constantes)
  const transactionsData = transactions
    .map((t) => {
      const tipo = TRANSACTION_TYPE_OPTIONS.find((opt) => opt.value === t.type)?.label || t.type;
      const categoria = TRANSACTION_CATEGORY_LABELS[t.category] || t.category;
      const metodoPagamento = TRANSACTION_PAYMENT_METHOD_LABELS[t.paymentMethod] || t.paymentMethod;

      return `${t.date.toLocaleDateString("pt-BR")} | R$${t.amount} | Tipo: ${tipo} | Categoria: ${categoria} | Pagamento: ${metodoPagamento}`;
    })
    .join("\n");

  const content = `Olá, meu nome é ${firstName}. Aqui estão as minhas transações deste mês:

${transactionsData}

Por favor, crie um relatório financeiro com a seguinte estrutura exata:

### Resumo Executivo
(Produza um balanço do mês focando em tópicos curtos: o saldo foi positivo, neutro ou negativo? Qual o impacto na saúde financeira?).

### Análise Detalhada de Despesas
(Examine os gastos utilizando bullet points. Liste os limites e possíveis excessos de forma objetiva, técnica e muito fácil de ler).

### Recomendações Estratégicas
(Liste exatamente 3 diretrizes financeiras estritamente personalizadas em formato de tópicos rápidos e diretos para aplicação prática).

### Considerações Finais
(Conclua com apenas 1 parágrafo curto de reflexão madura sobre os próximos passos, direcionando-se a mim pelo meu nome).`;

  try {
    // 6. Chamada para a IA gerar o conteúdo
    const result = await model.generateContent(content);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro na API do Gemini:", error);
    throw new Error(
      "Não foi possível gerar o relatório no momento. Tente novamente mais tarde."
    );
  }
};