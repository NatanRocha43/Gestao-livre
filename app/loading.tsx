import { Loader2 } from "lucide-react";

export default function GenericLoading() {
  return (
    // Essa div garante que o loading ocupe o espaço central da tela
    <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-3">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">
        Carregando...
      </p>
    </div>
  );
}