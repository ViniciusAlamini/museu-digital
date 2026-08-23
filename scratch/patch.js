const fs = require('fs');
const path = require('path');

const dir = 'src/app/actions';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

const entityMap = {
  'campaigns.ts': 'Campanha',
  'artworkFolders.ts': 'Pasta de Artes',
  'npcFolders.ts': 'Pasta de NPCs',
  'diaryEntries.ts': 'Entrada no Diário',
  'diaryFolders.ts': 'Pasta de Diário',
  'messages.ts': 'Mensagem',
};

for (const file of files) {
  if (!entityMap[file]) continue; // Skip those we already handled or are auth
  
  const filePath = path.join(dir, file);
  let code = fs.readFileSync(filePath, 'utf-8');
  
  if (!code.includes('logAudit')) {
    code = code.replace(/import { requireAuth } from "@\/lib\/auth";/, 'import { requireAuth } from "@/lib/auth";\nimport { logAudit } from "@/lib/audit";');
  }

  const type = entityMap[file];

  // Injetar create
  code = code.replace(
    /(await prisma\.\w+\.create\([\s\S]*?\}\);\s*revalidatePath)/,
    (match) => `await logAudit(${file === 'campaigns.ts' ? 'campaignId' : 'campaignId'}, session.username || "Desconhecido", "CRIOU", "${type}", "Item Adicionado");\n\n  ` + match
  );

  // Injetar update
  code = code.replace(
    /(await prisma\.\w+\.update\([\s\S]*?\}\);\s*revalidatePath)/,
    (match) => `await logAudit(${file === 'campaigns.ts' ? 'campaignId' : 'campaignId'}, session.username || "Desconhecido", "EDITOU", "${type}", "Item Modificado");\n\n  ` + match
  );

  // Injetar delete
  code = code.replace(
    /(await prisma\.\w+\.delete\(\{ where: \{ id: .*? \} \}\);\s*revalidatePath)/,
    (match) => `await logAudit(${file === 'campaigns.ts' ? 'campaignId' : 'campaignId'}, (typeof session !== 'undefined' ? session.username : "Desconhecido") || "Desconhecido", "EXCLUIU", "${type}", "Item Deletado");\n\n  ` + match
  );

  fs.writeFileSync(filePath, code);
  console.log(`Patched ${file}`);
}
