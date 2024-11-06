import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="grid h-full grid-cols-2">
      {/*Esquerda*/}
      <div className="mx-auto flex h-full max-w-[550px] flex-col justify-center p-8">
        <Image
          src={"/logo.svg"}
          width={175}
          height={40}
          alt="Gestão.ai"
          className="mb-8"
        />
        <h1 className="mb-3 text-4xl font-bold">Bem-vindo</h1>
        <p className="mb-8 text-muted-foreground">
          A Gestão AI é uma plataforma de gestão financeira que utiliza IA para
          monitorar suas movimentações, e oferecer insights personalizados,
          facilitando o controle do seu orçamento.
        </p>
        <Button variant="outline">
          <LogInIcon className="mr-2" />
          Fazer login ou criar conta
        </Button>
      </div>
      {/*Direita*/}
      <div className="relative h-full w-full">
        <Image
          src="/login.png"
          alt="Imagem do login"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
