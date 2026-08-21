"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, ImageIcon, FileText, MessageSquare, BookOpen } from "lucide-react";

const tabs = [
  { label: "Início", href: "", icon: Home },
  { label: "Personagens", href: "/characters", icon: Users },
  { label: "Desenhos", href: "/artworks", icon: ImageIcon },
  { label: "Posts", href: "/posts", icon: FileText },
  { label: "Mensagens", href: "/messages", icon: MessageSquare },
  { label: "Diário", href: "/diary", icon: BookOpen },
];

interface CampaignTabsProps {
  campaignId: string;
}

export function CampaignTabs({ campaignId }: CampaignTabsProps) {
  const pathname = usePathname();
  const base = `/campaigns/${campaignId}`;

  function isActive(tabHref: string) {
    const full = base + tabHref;
    if (tabHref === "") return pathname === base;
    return pathname.startsWith(full);
  }

  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex overflow-x-auto scrollbar-none">
          {tabs.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={base + href}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors",
                isActive(href)
                  ? "border-[var(--color-accent-purple)] text-[var(--color-accent-gold-light)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-secondary)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
