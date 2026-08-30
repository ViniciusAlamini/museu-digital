import { z } from "zod";

export const campaignSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  system: z.string().min(1, "Sistema é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  coverImage: z.string().optional(),
  startDate: z.string().min(1, "Data de início é obrigatória"),
});

export const characterSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  player: z.string().min(1, "Jogador é obrigatório"),
  image: z.string().optional(),
  race: z.string().min(1, "Raça é obrigatória"),
  characterClass: z.string().min(1, "Classe é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

export const artworkSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  image: z.string().min(1, "A imagem é obrigatória"),
  artist: z.string().min(1, "O artista é obrigatório"),
  description: z.string(),
  date: z.string().min(1, "A data é obrigatória"),
  folderId: z.string().optional().nullable(),
});

export const artworkFolderSchema = z.object({
  name: z.string().min(1, "O nome da pasta é obrigatório"),
  description: z.string().optional().nullable(),
  parentFolderId: z.string().optional().nullable(),
});

export const postSchema = z.object({
  title: z.string().min(3, "Mínimo de 3 caracteres"),
  content: z.string().min(10, "Mínimo de 10 caracteres"),
  image: z.string().optional(),
  author: z.string().min(2, "Obrigatório"),
  publishedAt: z.string().min(1, "Data obrigatória"),
});

export const messageSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "A mensagem não pode estar vazia"),
  author: z.string().min(2, "Autor é obrigatório"),
  characterId: z.string().optional(),
  eventDate: z.string().optional(),
  image: z.string().optional(),
  type: z.string().min(1, "Tipo é obrigatório"),
});

export const diaryFolderSchema = z.object({
  name: z.string().min(1, "Nome da pasta é obrigatório"),
  description: z.string().optional(),
  parentFolderId: z.string().optional(),
});

export const diaryEntrySchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  content: z.string().min(1, "O conteúdo não pode estar vazio"),
  imageUrl: z.string().optional().nullable(),
  fontFamily: z.string().optional(),
  author: z.string().min(2, "Autor é obrigatório"),
  relatedCharacterId: z.string().optional(),
  folderId: z.string().optional(),
  date: z.string().min(1, "Data obrigatória"),
});

export type CampaignFormValues = z.infer<typeof campaignSchema>;
export type CharacterFormValues = z.infer<typeof characterSchema>;
export type ArtworkFormValues = z.infer<typeof artworkSchema>;
export type PostFormValues = z.infer<typeof postSchema>;
export type MessageFormValues = z.infer<typeof messageSchema>;
export type DiaryFolderFormValues = z.infer<typeof diaryFolderSchema>;
export type DiaryEntryFormValues = z.infer<typeof diaryEntrySchema>;
