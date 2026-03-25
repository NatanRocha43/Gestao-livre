 

const HomeLoading = () => {
  return (
    <div className="flex flex-col space-y-6 p-6 lg:h-full ">
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 items-center sm:flex-row sm:justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-[200px] sm:w-[250px] rounded-md bg-muted/60 animate-pulse border border-solid border-border" />
          {/* Skeleton mock do PrivacyToggleButton */}
          <div className="h-8 w-8 rounded-md bg-muted/60 animate-pulse border border-solid border-border" />
        </div>
        <div className="flex w-full flex-col gap-3 min-[375px]:w-auto min-[375px]:flex-row items-center">
          {/* Mockup do Botão de Relatório IA */}
          <div className="h-10 w-full sm:w-[150px] rounded-md bg-muted animate-pulse" />
          {/* Mockup do Seletor de Mês */}
          <div className="h-10 w-full sm:w-[150px] rounded-full bg-muted animate-pulse" />
        </div>
      </div>

      {/* GRADE PRINCIPAL DO DASHBOARD */}
      <div className="flex flex-col gap-6 lg:grid lg:h-full lg:grid-cols-[2fr,1fr]">
        
        {/* COLUNA ESQUERDA (Cards de Resumo e Gráficos) */}
        <div className="flex flex-col gap-6">
          <div className="space-y-6">
            {/* Mockup Card Gigante de Saldo */}
            <div className="h-[150px] w-full rounded-xl bg-muted/60 animate-pulse border border-solid border-border" />
            {/* Mockup dos 3 Cards Menores (Receita, Despesa, Investimento) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="h-[120px] w-full rounded-xl bg-muted/60 animate-pulse border border-solid border-border" />
              <div className="h-[120px] w-full rounded-xl bg-muted/60 animate-pulse border border-solid border-border" />
              <div className="h-[120px] w-full rounded-xl bg-muted/60 animate-pulse border border-solid border-border" />
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:grid lg:h-full lg:grid-cols-3 lg:grid-rows-1">
            {/* Mockup do Gráfico Pizza (Pie Chart) */}
            <div className="h-[350px] w-full rounded-xl bg-muted/60 animate-pulse border border-solid border-border" />
            {/* Mockup das Barras de Despesas por Categoria */}
            <div className="col-span-2 h-[350px] w-full rounded-xl bg-muted/60 animate-pulse border border-solid border-border" />
          </div>
        </div>

        {/* COLUNA DIREITA (Últimas Transações) */}
        <div className="h-full w-full rounded-xl bg-muted/60 animate-pulse border border-solid border-border min-h-[500px]" />
      
      </div>
    </div>
  );
};

export default HomeLoading;
