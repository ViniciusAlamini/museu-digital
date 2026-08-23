"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Npc, NpcFolder } from "@prisma/client";

interface NpcFormProps {
  npc?: Npc;
  folders: NpcFolder[];
  defaultFolderId?: string;
}

export function NpcForm({ npc, folders, defaultFolderId }: NpcFormProps) {
  const [imageUrl, setImageUrl] = useState(npc?.image || "");

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <ImageUpload
          label="Imagem do NPC"
          value={imageUrl}
          onChange={setImageUrl}
          folder="npcs"
          aspectRatio="portrait"
        />
        <input type="hidden" name="image" value={imageUrl} />
      </div>

      <div className="space-y-5 md:col-span-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
            Nome *
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={npc?.name}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)]"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Raça / Espécie
            </label>
            <input
              type="text"
              name="race"
              defaultValue={npc?.race || ""}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Ocupação / Cargo
            </label>
            <input
              type="text"
              name="occupation"
              defaultValue={npc?.occupation || ""}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)]"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
            Pasta
          </label>
          <select
            name="folderId"
            defaultValue={npc?.folderId || defaultFolderId || ""}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)]"
          >
            <option value="">(Raiz)</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
            Descrição / História *
          </label>
          <textarea
            name="description"
            required
            rows={8}
            defaultValue={npc?.description}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
