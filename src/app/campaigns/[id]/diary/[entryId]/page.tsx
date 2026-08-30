import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteDiaryEntry } from "@/app/actions/diaryEntries";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit, Trash2, User, Calendar, Folder } from "lucide-react";
import Image from "next/image";

export default async function DiaryEntryDetailPage({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  const { id, entryId } = await params;

  const entry = await prisma.diaryEntry.findUnique({
    where: { id: entryId },
    include: { folder: true, relatedCharacter: true },
  });

  if (!entry || entry.campaignId !== id) notFound();

  // Mapeamento de fontes
  const fontClassMap: Record<string, string> = {
    inter: "font-inter",
    cinzel: "font-cinzel",
    caveat: "font-caveat text-xl sm:text-2xl leading-relaxed",
    courier: "font-courier",
    playfair: "font-playfair text-lg leading-relaxed",
  };
  const contentFontClass = fontClassMap[entry.fontFamily] || "font-inter";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/campaigns/${id}/diary${entry.folderId ? `?folderId=${entry.folderId}` : ""}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o Diário
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/campaigns/${id}/diary/${entryId}/edit`}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors bg-[var(--color-bg-elevated)]"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
          <DeleteDialog
            title="Excluir Entrada"
            description={`Tem certeza que deseja excluir "${entry.title}"?`}
            onConfirm={async () => {
              "use server";
              await deleteDiaryEntry(entryId, id, entry.folderId);
            }}
            trigger={
              <button className="flex items-center gap-2 rounded-lg border border-red-900/40 px-3 py-2 text-sm text-red-400 hover:border-red-700 hover:bg-red-950/20 transition-colors bg-[var(--color-bg-elevated)]">
                <Trash2 className="h-4 w-4" />
              </button>
            }
          />
        </div>
      </div>

      <div className="relative">
        {/* Sombra de profundidade para o papel */}
        <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-sm bg-black/40 blur-sm -z-10" />
        
        {/* Fundo estilo papel */}
        <article className="relative min-h-[700px] overflow-hidden rounded-sm bg-[#f4ecd8] text-[#3d3224] p-8 sm:p-12 md:p-16 shadow-[inset_0_0_40px_rgba(0,0,0,0.1),_0_0_10px_rgba(0,0,0,0.3)] border border-[#d6c7ab]">
          
          {/* Efeito de textura base (ruído suave/manchas) - CSS Puro */}
          <div className="pointer-events-none absolute inset-0 opacity-20"
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
          </div>

          <div className="relative z-10">
            {/* Metadados (Data, Autor) estilo carimbo/etiqueta */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b-2 border-[#bfae8e]/40 font-courier text-sm text-[#73634d]">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
                  <User className="h-4 w-4" />
                  {entry.author}
                </span>
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
                  <Calendar className="h-4 w-4" />
                  {formatDate(entry.date)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs opacity-70">
                {entry.folder && (
                  <span className="flex items-center gap-1.5 border border-[#73634d]/30 px-2 py-1">
                    <Folder className="h-3.5 w-3.5" />
                    {entry.folder.name}
                  </span>
                )}
                {entry.relatedCharacter && (
                  <span className="bg-[#bfae8e]/20 px-2 py-1">
                    {entry.relatedCharacter.name}
                  </span>
                )}
              </div>
            </div>

            {/* Imagem em anexo com estilos diferentes */}
            {entry.imageUrl && (
              <div className={`mb-10 float-none lg:float-right lg:ml-8 lg:mb-6 transition-transform duration-500 ${
                entry.imageStyle === 'polaroid' ? 'rotate-1 hover:rotate-0' : ''
              }`}>
                
                {entry.imageStyle === 'polaroid' && (
                  <div className="bg-white p-3 pb-8 shadow-md border border-gray-200 rounded-sm w-full lg:w-72 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/40 border border-white/50 shadow-sm rotate-[-2deg] backdrop-blur-sm z-20 mix-blend-overlay"></div>
                    <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                      <Image src={entry.imageUrl} alt="Anexo do Diário" fill className="object-cover sepia-[0.2] contrast-125" />
                    </div>
                  </div>
                )}

                {entry.imageStyle === 'medieval' && (
                  <div className="w-full lg:w-72 relative p-2 bg-[#1a140f] border-4 border-[#8c7348] rounded-md shadow-2xl ring-2 ring-[#4a3a2a]">
                    <div className="absolute inset-0 border border-[#b89f66] m-1 pointer-events-none z-10"></div>
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1a140f]">
                      <Image src={entry.imageUrl} alt="Retrato Medieval" fill className="object-cover sepia-[0.4] contrast-[1.1] brightness-[0.9]" />
                    </div>
                  </div>
                )}

                {entry.imageStyle === 'sketch' && (
                  <div className="w-full lg:w-72 relative opacity-90 mix-blend-multiply filter grayscale sepia-[0.5] contrast-[1.4] brightness-[1.1] hover:grayscale-0 transition-all duration-1000">
                    <div className="relative aspect-square w-full overflow-hidden mask-image-edges">
                      <Image src={entry.imageUrl} alt="Rascunho" fill className="object-cover rounded-3xl blur-[0.5px]" />
                    </div>
                  </div>
                )}

                {entry.imageStyle === 'torn' && (
                  <div className="w-full lg:w-72 relative p-1 bg-[#fff8e7] shadow-sm transform -rotate-1 hover:rotate-1 transition-transform">
                    {/* Borda imitando rasgado */}
                    <div className="absolute inset-0 border border-dashed border-[#8c7348]/40 -m-1"></div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 mix-blend-multiply opacity-90 sepia-[0.3]">
                      <Image src={entry.imageUrl} alt="Papel Rasgado" fill className="object-cover" />
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Título */}
            <h1 className={`text-4xl sm:text-5xl font-bold mb-8 text-[#2c2214] font-cinzel leading-tight ${entry.imageUrl ? 'mt-4' : ''}`}>
              {entry.title}
            </h1>

            {/* Conteúdo Rico com a fonte selecionada */}
            <div
              className={`prose prose-stone max-w-none prose-headings:font-cinzel prose-headings:text-[#2c2214] prose-a:text-blue-900 prose-strong:text-[#2c2214] prose-img:rounded-md prose-img:sepia-[0.2] ${contentFontClass} text-[#3d3224] leading-relaxed`}
              dangerouslySetInnerHTML={{ __html: entry.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
