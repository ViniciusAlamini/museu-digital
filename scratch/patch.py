import os, glob

dir_path = 'src/app/actions'
files = glob.glob(os.path.join(dir_path, '*.ts'))

entity_map = {
  'campaigns.ts': 'Campanha',
  'characters.ts': 'Personagem',
  'artworks.ts': 'Arte',
  'artworkFolders.ts': 'Pasta de Artes',
  'sessions.ts': 'Sessão',
  'npcFolders.ts': 'Pasta de NPCs',
  'diaryEntries.ts': 'Entrada no Diário',
  'diaryFolders.ts': 'Pasta de Diário',
  'messages.ts': 'Mensagem',
}

for filepath in files:
    filename = os.path.basename(filepath)
    if filename == 'auth.ts' or filename == 'npcs.ts': continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()
        
    if 'logAudit' not in code:
        code = code.replace('import { requireAuth } from "@/lib/auth";', 'import { requireAuth } from "@/lib/auth";\nimport { logAudit } from "@/lib/audit";')
        
    entity = entity_map.get(filename, 'Item')
    camp_id = 'campaign.id' if filename == 'campaigns.ts' else 'campaignId'
    
    # Very basic replace for CREATE
    code = code.replace(
        'revalidatePath(',
        f'// HACK: Needs manual review\n  revalidatePath('
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
