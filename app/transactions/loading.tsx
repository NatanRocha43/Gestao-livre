const TransactionsLoading = () => {
  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden p-6 lg:p-8">
      {/* CABEÇALHO */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Transações</h1>
          {/* Skeleton do botão Privacy */}
          <div className="h-8 w-8 rounded-md bg-muted/60 animate-pulse border border-solid border-border" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Skeleton do AddTransactionButton */}
          <div className="h-10 w-[180px] rounded-full bg-muted/60 animate-pulse" />
        </div>
      </div>

      {/* ÁREA DA TABELA DE TRANSAÇÕES */}
      <div className="flex flex-col space-y-6 flex-1">
        
        {/* Skeleton dos Filtros ("Pílulas") */}
        <div className="flex w-full sm:w-auto sm:justify-start">
          <div className="h-10 w-full sm:w-[200px] rounded-full bg-muted/60 animate-pulse" />
        </div>

        {/* Skeleton da DataTable (1 Cabeçalho + Múltiplas Linhas) */}
        <div className="rounded-md border border-solid border-border">
          {/* Linha do Header */}
          <div className="h-12 border-b border-border bg-muted/20 animate-pulse" />
          
          {/* Linhas da Tabela (10 linhas geradas como mock) */}
          <div className="flex flex-col divide-y divide-border">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex h-16 w-full items-center px-4 gap-4 bg-muted/10 animate-pulse">
                <div className="h-6 w-full rounded bg-muted/40" />
                <div className="h-6 w-full rounded bg-muted/40" />
                <div className="h-6 w-full rounded bg-muted/40" />
                <div className="hidden md:block h-6 w-full rounded bg-muted/40" />
                <div className="h-8 w-8 ml-auto rounded bg-muted/40 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsLoading;
