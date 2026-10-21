import Link from "next/link";
import { ArchiveMark } from "./ArchiveMark";

export function ArchiveBrand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      className="archive-brand"
      onClick={onNavigate}
      aria-label="Museu Digital — início"
    >
      <ArchiveMark />
      <span>
        <strong>Museu Digital</strong>
        <small>Um arquivo de aventuras</small>
      </span>
    </Link>
  );
}
