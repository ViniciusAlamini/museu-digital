"use client";
import Link from "next/link";
import { BookX, RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <EmptyState
        icon={BookX}
        title="Não foi possível abrir esta página"
        description="Houve uma falha ao consultar o acervo. Tente novamente para retomar a leitura."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={retry} className="btn btn-primary">
              <RotateCcw />
              Tentar novamente
            </button>
            <Link href="/" className="btn btn-secondary">
              Voltar ao acervo
            </Link>
          </div>
        }
      />
    </div>
  );
}
