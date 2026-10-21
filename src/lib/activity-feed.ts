type ActivitySource = {
  campaignId: string;
  action: string;
  entityType: string;
  details?: string | null;
};

type ActivityKind = "artwork" | "character" | "post" | "message" | "diary" | "folder" | "campaign";
type ActivityType = { noun: string; path: string; kind: ActivityKind; verb: string };
const types: Record<string, ActivityType> = {
  obra: { noun: "um desenho", path: "/artworks", kind: "artwork", verb: "adicionou" },
  arte: { noun: "um desenho", path: "/artworks", kind: "artwork", verb: "adicionou" },
  personagem: { noun: "um personagem", path: "/characters", kind: "character", verb: "adicionou" },
  npc: { noun: "um NPC", path: "", kind: "character", verb: "adicionou" },
  post: { noun: "uma história", path: "/posts", kind: "post", verb: "publicou" },
  correspondencia: { noun: "uma mensagem", path: "/messages", kind: "message", verb: "publicou" },
  mensagem: { noun: "uma mensagem", path: "/messages", kind: "message", verb: "publicou" },
  registro: { noun: "no diário", path: "/diary", kind: "diary", verb: "escreveu" },
  "entrada no diario": { noun: "no diário", path: "/diary", kind: "diary", verb: "escreveu" },
  "pasta de obras": { noun: "uma pasta de desenhos", path: "/artworks", kind: "folder", verb: "criou" },
  "pasta de artes": { noun: "uma pasta de desenhos", path: "/artworks", kind: "folder", verb: "criou" },
  "pasta do diario": { noun: "uma pasta do diário", path: "/diary", kind: "folder", verb: "criou" },
  campanha: { noun: "uma campanha", path: "", kind: "campaign", verb: "criou" },
};

export function describeActivity(event: ActivitySource, existingRecordLinks?: ReadonlySet<string>) {
  const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("pt-BR");
  const type = types[normalize(event.entityType)] ?? { noun: "um registro", path: "", kind: "campaign" as const, verb: "adicionou" };
  const action = normalize(event.action);
  const deleted = action === "excluiu";
  const verb = deleted ? "removeu" : action === "editou" ? "atualizou" : type.verb;
  const noun = type.kind === "diary" && action !== "criou" ? "uma entrada do diário" : type.noun;
  const section = `/campaigns/${event.campaignId}${type.path}`;
  let href = section;
  // Older logs may contain arbitrary details or links to retired sections.
  if (!deleted && event.details && type.path) {
    try {
      const url = new URL(event.details, "https://library.local");
      const suffix = url.pathname.slice(section.length);
      if (url.origin === "https://library.local" && url.pathname.startsWith(section) &&
        /^(?:\/[\w-]+)?$/.test(suffix)) href = url.pathname + url.search + url.hash;
    } catch { /* Use the existing campaign section when no valid link is stored. */ }
  }
  if (existingRecordLinks && href !== section) {
    const url = new URL(href, "https://library.local");
    const isRecord = url.pathname !== section || (type.kind === "message" && url.hash.startsWith("#message-"));
    const key = type.kind === "message" ? url.pathname + url.hash : url.pathname;
    if (isRecord && !existingRecordLinks.has(key)) href = section;
  }
  return { text: `${verb} ${noun}`, kind: type.kind, href, deleted };
}
