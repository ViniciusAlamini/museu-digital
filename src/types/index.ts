export interface Campaign {
  id: string;
  name: string;
  system: string;
  description: string;
  coverImage: string | null;
  startDate: Date;
  createdAt: Date;
}

export interface Character {
  id: string;
  campaignId: string;
  name: string;
  player: string;
  image: string | null;
  race: string;
  characterClass: string;
  description: string;
  createdAt: Date;
}

export interface ArtworkFolder {
  id: string;
  campaignId: string;
  parentFolderId: string | null;
  name: string;
  description: string | null;
  createdAt: Date;
  subfolders?: ArtworkFolder[];
  artworks?: Artwork[];
}

export interface Artwork {
  id: string;
  campaignId: string;
  folderId: string | null;
  title: string;
  image: string;
  artist: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface Post {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  image?: string | null;
  author: string;
  publishedAt: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  campaignId: string;
  title?: string | null;
  content: string;
  author: string;
  characterId?: string | null;
  eventDate?: Date | null;
  image?: string | null;
  type: string;
  createdAt: Date;
}

export interface DiaryFolder {
  id: string;
  campaignId: string;
  parentFolderId?: string | null;
  name: string;
  description?: string | null;
  createdAt: Date;
}

export interface DiaryEntry {
  id: string;
  campaignId: string;
  folderId?: string | null;
  title: string;
  content: string;
  imageUrl?: string | null;
  fontFamily: string;
  author: string;
  relatedCharacterId?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
