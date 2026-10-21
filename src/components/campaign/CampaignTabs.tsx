"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Users,
  ImageIcon,
  FileText,
  MessageSquare,
  Feather,
} from "lucide-react";
const tabs = [
  { label: "Início", path: "", icon: BookOpen },
  { label: "Personagens", path: "/characters", icon: Users },
  { label: "Desenhos", path: "/artworks", icon: ImageIcon },
  { label: "Posts", path: "/posts", icon: FileText },
  { label: "Mensagens", path: "/messages", icon: MessageSquare },
  { label: "Diário", path: "/diary", icon: Feather },
];
export function CampaignTabs({ campaignId }: { campaignId: string }) {
  const pathname = usePathname();
  const base = `/campaigns/${campaignId}`;
  return (
    <nav className="campaign-mobile-tabs" aria-label="Seções da campanha">
      {tabs.map(({ label, path, icon: Icon }) => (
        <Link
          key={path}
          href={base + path}
          aria-current={
            (path ? pathname.startsWith(base + path) : pathname === base)
              ? "page"
              : undefined
          }
        >
          <Icon />
          {label}
        </Link>
      ))}
    </nav>
  );
}
