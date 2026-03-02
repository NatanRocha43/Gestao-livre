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
    systemInstruction: `Você é um consultor financeiro sênior, empático e direto ao ponto. 
    Seu objetivo é analisar as finanças do usuário e fornecer um relatório claro, organizado e fácil de ler.
    REGRAS OBRIGATÓRIAS:
    - Use Markdown SEMPRE.
    - Estruture a resposta com os títulos exatos fornecidos no prompt.
    - Use emojis para tornar a leitura amigável e moderna.
    - Seja conciso: evite parágrafos gigantes e contas matemáticas complexas.
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

### 📊 Resumo do Mês
(Faça um balanço geral e direto: o mês foi positivo, neutro ou negativo? Foque na sensação geral e no fluxo de caixa).

### 🔍 Análise de Gastos
(Destaque em quais categorias eu mais gastei, se há algum alerta de exagero e o que foi positivo).

### 💡 3 Dicas de Ouro
(Dê exatamente 3 conselhos práticos e altamente personalizados com base nas categorias em que gastei).

### 🎯 Conclusão
(Encerre com uma frase motivacional curta sobre inteligência financeira, me chamando pelo nome).`;

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