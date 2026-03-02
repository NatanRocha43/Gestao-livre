"use client";

import { Button } from "@/app/_components/ui/button";
import Markdown from "react-markdown";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { BotIcon, Loader2Icon } from "lucide-react";
import { generateAiReport } from "../_actions/generate-ai-report";
import { useState } from "react";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface AiReportButtonProps {
  hasPremiumPlan: boolean;
  month: string;
}

const AiReportButton = ({ month, hasPremiumPlan }: AiReportButtonProps) => {
  const [reportIsLoading, setReportIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleGenerateReportClick = async () => {
    try {
      setReportIsLoading(true);
      const report = await generateAiReport(month);
      setReport(report);
    } catch (error) {
      console.error(error);
    } finally {
      setReportIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && setReport(null)}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="font-bold">
          <BotIcon className="mr-2" />
          Relatório IA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        {hasPremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle>Relatório com IA</DialogTitle>
            </DialogHeader>
            
            {report ? (
              <ScrollArea className="max-h-[450px] w-full rounded-md border border-solid p-4">
                <article className="prose prose-invert max-w-none prose-h3:text-primary prose-h4:text-primary prose-strong:text-primary prose-p:text-muted-foreground prose-li:text-muted-foreground">
                  <Markdown remarkPlugins={[remarkGfm]}>{report}</Markdown>
                </article>
              </ScrollArea>
            ) : (
              <div className="flex h-[150px] items-center justify-center text-muted-foreground">
                {reportIsLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                    <p>A IA está analisando seus dados...</p>
                  </div>
                ) : (
                  <p>Clique abaixo para gerar seu relatório mensal.</p>
                )}
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" className="font-bold">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                onClick={handleGenerateReportClick}
                disabled={reportIsLoading}
                className="font-bold"
              >
                {reportIsLoading ? (
                  <>
                    <Loader2Icon className="mr-2 animate-spin" />
                    Gerando relatório...
                  </>
                ) : (
                  "Gerar relatório"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Relatório com IA</DialogTitle>
              <DialogDescription>
                Para gerar um relatório com inteligência artificial, você
                precisa ter uma assinatura premium.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" className="font-bold">
                  Cancelar
                </Button>
              </DialogClose>
              <Button asChild>
                <Link href="/subscription">Assinar premium</Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;