"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { usePrivacy } from "@/app/_contexts/privacy-context";

export const PrivacyToggleButton = () => {
  const { isVisible, toggleVisibility } = usePrivacy();

  return (
    <button
      onClick={toggleVisibility}
      className="text-muted-foreground transition-colors hover:text-white"
      title={isVisible ? "Ocultar valores" : "Mostrar valores"}
    >
      {isVisible ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
    </button>
  );
};
