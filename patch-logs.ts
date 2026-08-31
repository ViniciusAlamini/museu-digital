import { prisma } from './src/lib/prisma';

async function main() {
  const logs = await prisma.auditLog.findMany({
    where: { details: null },
  });
  console.log(`Found ${logs.length} logs to patch.`);

  let patchedCount = 0;

  for (const log of logs) {
    let url = null;
    try {
      if (log.entityType === 'Personagem') {
        const item = await prisma.character.findFirst({ where: { campaignId: log.campaignId, name: log.entityName } });
        if (item) url = `/campaigns/${log.campaignId}/characters/${item.id}`;
      } else if (log.entityType === 'Arte') {
        const item = await prisma.artwork.findFirst({ where: { campaignId: log.campaignId, title: log.entityName } });
        if (item) url = `/campaigns/${log.campaignId}/artworks/${item.id}`;
      } else if (log.entityType === 'NPC') {
        const item = await prisma.npc.findFirst({ where: { campaignId: log.campaignId, name: log.entityName } });
        if (item) url = `/campaigns/${log.campaignId}/npcs/${item.id}`;
      } else if (log.entityType === 'Sessão') {
        const item = await prisma.session.findFirst({ where: { campaignId: log.campaignId, title: log.entityName } });
        if (item) url = `/campaigns/${log.campaignId}/sessions/${item.id}`;
      } else if (log.entityType === 'Entrada no Diário') {
        const item = await prisma.diaryEntry.findFirst({ where: { campaignId: log.campaignId, title: log.entityName } });
        if (item) url = `/campaigns/${log.campaignId}/diary/${item.id}`;
      }

      if (url) {
        await prisma.auditLog.update({
          where: { id: log.id },
          data: { details: url },
        });
        patchedCount++;
      }
    } catch (e: any) {
      console.log(`Failed to patch log ${log.id}:`, e?.message || e);
    }
  }

  console.log(`Patched ${patchedCount} logs!`);
}

main().finally(() => prisma.$disconnect());
