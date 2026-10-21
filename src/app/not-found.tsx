import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <EmptyState
        icon={Compass}
        title="Este caminho saiu do mapa"
        description="A página procurada não foi encontrada. Volte ao acervo para escolher outra aventura."
        action={
          <Link href="/" className="btn btn-primary">
            <ArrowLeft />
            Voltar ao acervo
          </Link>
        }
      />
    </div>
  );
}
