const SubscriptionLoading = () => {
  return (
    <div className="p-6 pb-20 space-y-6">
      
      {/* TÍTULO CENTRALIZADO */}
      <div className="mx-auto mb-12 flex max-w-[800px] flex-col items-center justify-center pt-8 text-center space-y-4">
        {/* Mock do Título H1 Múltiplas Linhas */}
        <div className="h-12 w-3/4 max-w-[500px] rounded-md bg-muted/60 animate-pulse" />
        {/* Mock do Subtítulo p */}
        <div className="h-6 w-full max-w-[600px] rounded-md bg-muted/60 animate-pulse mt-4" />
        <div className="h-6 w-5/6 max-w-[600px] rounded-md bg-muted/60 animate-pulse" />
      </div>
      
      {/* WRAPPER DOS CARDS DE VENDA (SaaS) */}
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch">
        
        {/* MOCK PLANO BÁSICO */}
        <div className="w-full lg:w-[450px] h-[400px] rounded-xl border border-solid border-border bg-muted/10 animate-pulse flex flex-col items-center p-8">
          <div className="h-6 w-24 rounded-full bg-muted/60 mb-8" />
          <div className="h-8 w-3/4 rounded-md bg-muted/60 mb-6" />
          <div className="h-16 w-1/2 rounded-md bg-muted/60 mb-10" />
          <div className="w-full space-y-4">
            <div className="h-6 w-full rounded bg-muted/40" />
            <div className="h-6 w-5/6 rounded bg-muted/40" />
          </div>
        </div>

        {/* MOCK PLANO PREMIUM (Com borda mais grossa como o original) */}
        <div className="w-full lg:w-[450px] h-[400px] rounded-xl border-2 border-primary/20 bg-muted/10 animate-pulse flex flex-col items-center p-8 shadow-2xl">
          <div className="h-6 w-32 rounded-full bg-primary/40 mb-8" />
          <div className="h-8 w-3/4 rounded-md bg-muted/60 mb-6" />
          <div className="h-16 w-1/2 rounded-md bg-muted/60 mb-10" />
          <div className="w-full space-y-4">
            <div className="h-6 w-full rounded bg-muted/40" />
            <div className="h-6 w-full rounded bg-muted/40" />
            <div className="h-10 w-full rounded-full bg-muted/60 mt-8" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionLoading;
