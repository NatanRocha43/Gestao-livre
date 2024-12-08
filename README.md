# Gestão Livre - IA 🚀

**Gestão Livre** é um sistema inovador de gestão financeira, aproveitando o poder da inteligência artificial para gerar relatórios detalhados e insights financeiros. O projeto também oferece integração de pagamento para assinaturas usando o **Stripe**.

---

## 🛠️ Tecnologias Utilizadas

### Front-end
- [Next.js](https://nextjs.org/)  
- [React.js](https://reactjs.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [ShadCN](https://shadcn.dev/)

### Back-end
- [Node.js](https://nodejs.org/)  
- [Prisma ORM](https://www.prisma.io/)  
- [NeonDB](https://neon.tech/) - Hospedagem do banco de dados PostgreSQL  
- [TypeScript](https://www.typescriptlang.org/)  
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

### Pagamentos
- [Stripe](https://stripe.com/)

### Autenticação
- [Clerk](https://clerk.dev/)

---

## 🚀 Como Iniciar o Projeto

Siga as etapas abaixo para configurar e rodar o projeto localmente:

### 📋 Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:
- **[Node.js](https://nodejs.org/)** (versão 18 ou superior)  
- **npm** ou **[yarn](https://yarnpkg.com/)**  

### 🛠️ Passos para Configuração

1. **Clone o Repositório**  
   Abra o terminal e execute:
   ```bash
   git clone https://github.com/seu-usuario/gestao-livre-ia.git
   cd gestao-livre
2. **Instale as Dependências**
 Abra o terminal e execute:
   ```bash
   npm install
   # ou
   yarn install
3. Configure o arquivo .env
  # DATABASE_URL=
  - **DATABASE_URL=**

  #Clerk
  - **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=**
  - **CLERK_SECRET_KEY=**
  
  #Stripe
  - **STRIPE_PREMIUM_PLAN_PRICE_ID=**
  - **STRIPE_SECRET_KEY=**
  - **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=**
  - **STRIPE_WEBHOOK_SECRET=**
  - **NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL=**
  
  #IA
  - **OPENAI_API_KEY=**
  - **APP_URL=**

4. Configure o Prisma
Abra o terminal e execute:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
5. Inicie o Servidor
Abra o terminal e execute:
   ```bash
   npm run dev
   # ou
   yarn dev
6. Acesse a Aplicação

---

O projeto local estará rodando em:
👉 http://localhost:3000
O Projeto em Produção está rodando em:
👉 [https://gestao-livre.vercel.app/login](https://gestao-livre.vercel.app/login)

**📖 Funcionalidades**
- **🔒 Autenticação segura com Clerk**
- **💳 Integração com Stripe para assinaturas e pagamentos**
- **🧠 Geração de relatórios financeiros com IA**
- **📊 Visualização e gerenciamento de despesas e receitas**
- **🛠️ Configuração fácil para novos usuários**
  

**📦 Dependências Principais**
- **next: Framework React para renderização híbrida (SSG/SSR)**
- **react: Biblioteca para construção de interfaces de usuário**
- **tailwindcss: Framework CSS para estilos rápidos e customizáveis**
- **prisma: ORM para interação com o banco de dados**
- **@prisma/client: Client do Prisma para consultas no banco**
- **@shadcn/ui: Componentes pré-construídos e estilizados com Tailwind**
- **clerk: Serviço de autenticação e gerenciamento de usuários**
- **stripe: Biblioteca para integração com a API de pagamentos**
