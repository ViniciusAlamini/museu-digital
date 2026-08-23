import os

def patch_file(filepath, entity_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    if 'logAudit' in code:
        return

    # Add import
    code = code.replace('import { requireAuth } from "@/lib/auth";', 'import { requireAuth } from "@/lib/auth";\nimport { logAudit } from "@/lib/audit";')
    
    # 1. CREATE
    code = code.replace(
        'revalidatePath(`/campaigns/${campaignId}',
        f'const sessionForLog = await requireAuth("player");\n  await logAudit(campaignId, sessionForLog.username || "Desconhecido", "AÇÃO", "{entity_name}", "Item Modificado");\n\n  revalidatePath(`/campaigns/${{campaignId}}'
    )
    
    # this will inject in all revalidatePath lines... but wait, I can just replace `redirect(` to inject right before it?
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)

patch_file('src/app/actions/artworks.ts', 'Arte')
patch_file('src/app/actions/artworkFolders.ts', 'Pasta de Artes')
patch_file('src/app/actions/diaryEntries.ts', 'Entrada no Diário')
patch_file('src/app/actions/diaryFolders.ts', 'Pasta de Diário')
patch_file('src/app/actions/messages.ts', 'Mensagem')
