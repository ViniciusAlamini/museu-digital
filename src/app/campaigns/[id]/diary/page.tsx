import { prisma } from "@/lib/prisma";
import { DiaryExplorer } from "@/components/diary/DiaryExplorer";

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
    <div className="space-y-6">
      <h2 className="font-fantasy text-2xl font-semibold text-[var(--color-text-primary)]">
        Diário da Campanha
      </h2>
      <DiaryExplorer campaignId={id} folders={folders} entries={entries} />
    </div>
  );
}
