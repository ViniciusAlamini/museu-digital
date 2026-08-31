const fs = require('fs');
const path = require('path');

const actionsDir = path.join(process.cwd(), 'src/app/actions');
const files = fs.readdirSync(actionsDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(actionsDir, file), 'utf-8');
  
  // Replace calls with the URL as the 6th argument (details)
  // For characters
  content = content.replace(/logAudit\(campaignId, (.*?), "CRIOU", "Personagem", character\.name\);/g, 
    'logAudit(campaignId, $1, "CRIOU", "Personagem", character.name, `/campaigns/${campaignId}/characters/${character.id}`);');
  content = content.replace(/logAudit\(campaignId, (.*?), "EDITOU", "Personagem", validated\.name\);/g, 
    'logAudit(campaignId, $1, "EDITOU", "Personagem", validated.name, `/campaigns/${campaignId}/characters/${id}`);');

  // For artworks
  content = content.replace(/logAudit\(campaignId, (.*?), "CRIOU", "Arte", validated\.title\);/g, 
    'logAudit(campaignId, $1, "CRIOU", "Arte", validated.title, `/campaigns/${campaignId}/artworks/${artwork.id}`);');
  content = content.replace(/logAudit\(campaignId, (.*?), "EDITOU", "Arte", validated\.title\);/g, 
    'logAudit(campaignId, $1, "EDITOU", "Arte", validated.title, `/campaigns/${campaignId}/artworks/${id}`);');

  // For NPCs
  content = content.replace(/logAudit\(campaignId, (.*?), "CRIOU", "NPC", name\);/g, 
    'logAudit(campaignId, $1, "CRIOU", "NPC", name, `/campaigns/${campaignId}/npcs/${npc.id}`);');
  content = content.replace(/logAudit\(campaignId, (.*?), "EDITOU", "NPC", name\);/g, 
    'logAudit(campaignId, $1, "EDITOU", "NPC", name, `/campaigns/${campaignId}/npcs/${id}`);');

  // For sessions (character is 'Sessão', wait we use ascii strings maybe? in code it's "Sessão" but powershell might ruin it. Let's use regex matching "Sess.*")
  content = content.replace(/logAudit\(campaignId, (.*?), "CRIOU", "Sessão", title\);/g, 
    'logAudit(campaignId, $1, "CRIOU", "Sessão", title, `/campaigns/${campaignId}/sessions/${session.id}`);');
  content = content.replace(/logAudit\(campaignId, (.*?), "EDITOU", "Sessão", title\);/g, 
    'logAudit(campaignId, $1, "EDITOU", "Sessão", title, `/campaigns/${campaignId}/sessions/${id}`);');

  // For diaries
  content = content.replace(/logAudit\(campaignId, (.*?), "CRIOU", "Entrada no Diário", title\);/g, 
    'logAudit(campaignId, $1, "CRIOU", "Entrada no Diário", title, `/campaigns/${campaignId}/diary/${entry.id}`);');
  content = content.replace(/logAudit\(campaignId, (.*?), "EDITOU", "Entrada no Diário", title\);/g, 
    'logAudit(campaignId, $1, "EDITOU", "Entrada no Diário", title, `/campaigns/${campaignId}/diary/${id}`);');

  fs.writeFileSync(path.join(actionsDir, file), content);
});
