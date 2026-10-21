import Link from "next/link";
import { Character } from "@/types";
import { ArchiveImage } from "@/components/shared/ArchiveImage";
export function CharacterCard({
  character,
  campaignId,
}: {
  character: Character;
  campaignId: string;
}) {
  return (
    <Link
      href={`/campaigns/${campaignId}/characters/${character.id}`}
      className="character-card"
    >
      <div className="character-portrait">
        <ArchiveImage
          src={character.image}
          alt={character.name}
          fill
          variant="portrait"
          className="object-cover"
        />
      </div>
      <div className="character-caption">
        <div className="character-tags">
          <span>{character.race}</span>
          <span>{character.characterClass}</span>
        </div>
        <h2>{character.name}</h2>
        <p>Interpretado por {character.player}</p>
      </div>
    </Link>
  );
}
