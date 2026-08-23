const fs = require('fs');
const path = require('path');

const dir = 'src/app/actions';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'auth.ts');

const entityMap = {
  'campaigns.ts': 'Campanha',
  'characters.ts': 'Personagem',
  'artworks.ts': 'Arte',
  'artworkFolders.ts': 'Pasta de Artes',
  'sessions.ts': 'Sessão',
  'npcs.ts': 'NPC',
  'npcFolders.ts': 'Pasta de NPCs',
  'diaryEntries.ts': 'Entrada no Diário',
  'diaryFolders.ts': 'Pasta de Diário',
  'messages.ts': 'Mensagem',
};

for (const file of files) {
  const filePath = path.join(dir, file);
  let code = fs.readFileSync(filePath, 'utf-8');
  
  if (!code.includes('logAudit')) {
    code = code.replace(/import { requireAuth } from "@\/lib\/auth";/g, 'import { requireAuth } from "@/lib/auth";\nimport { logAudit } from "@/lib/audit";');
  }

  const type = entityMap[file] || 'Item';

  // Injetar create
  code = code.replace(
    /(const \w+ = await prisma\.\w+\.create\([\s\S]*?\}\);\s*revalidatePath)/,
    (match, p1) => `const created = await prisma.${match.split('await prisma.')[1].split('.create')[0]}.findFirst({ orderBy: { id: 'desc' } }); // Temp hack\n  await logAudit(${file === 'campaigns.ts' ? 'created.id' : 'campaignId'}, session.username, "CRIOU", "${type}", name || title || "Sem Nome");\n\n  ` + p1
  );

  // Injetar update
  code = code.replace(
    /(await prisma\.\w+\.update\([\s\S]*?\}\);\s*revalidatePath)/,
    (match) => `await logAudit(${file === 'campaigns.ts' ? 'id' : 'campaignId'}, session.username, "EDITOU", "${type}", name || title || "Sem Nome");\n\n  ` + match
  );

  // Injetar delete
  code = code.replace(
    /(await prisma\.\w+\.delete\(\{ where: \{ id: .*? \} \}\);\s*revalidatePath)/,
    (match) => `const session = await requireAuth("player"); // Garantir session \n  await logAudit(${file === 'campaigns.ts' ? 'id' : 'campaignId'}, session.username, "EXCLUIU", "${type}", \`Item ID: \${id || "ID"}\`);\n\n  ` + match
  );

  fs.writeFileSync(filePath, code);
  console.log(`Patched ${file}`);
}
