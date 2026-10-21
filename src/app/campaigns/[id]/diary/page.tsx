import { prisma } from "@/lib/prisma";
import { DiaryExplorer } from "@/components/diary/DiaryExplorer";
import { PageHeader } from "@/components/shared/PageHeader";
export default async function DiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [folders, entries] = await Promise.all([
    prisma.diaryFolder.findMany({
      where: { campaignId: id },
      orderBy: { name: "asc" },
    }),
    prisma.diaryEntry.findMany({
      where: { campaignId: id },
      orderBy: { date: "desc" },
    }),
  ]);
  return (
    <section>
      <PageHeader
        eyebrow={`O códice · ${entries.length} registros`}
        title="Diário de viagem"
        description="Uma página para cada lembrança. Um índice para reencontrar o caminho."
      />
      <DiaryExplorer campaignId={id} folders={folders} entries={entries} />
    </section>
  );
}
