"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  Feather,
  FileText,
  ImageIcon,
  Library,
  Menu,
  MessageSquare,
  Plus,
  Users,
  X,
} from "lucide-react";
import { ArchiveBrand } from "./ArchiveBrand";
import { logout } from "@/app/actions/auth";

type NavCampaign = { id: string; name: string; system: string };
type SessionUser = { id: string; username: string; role: string };
const sections = [
  { label: "Folha de rosto", path: "", icon: BookOpen },
  { label: "Personagens", path: "/characters", icon: Users },
  { label: "Desenhos & mapas", path: "/artworks", icon: ImageIcon },
  { label: "Posts & histórias", path: "/posts", icon: FileText },
  { label: "Correspondências", path: "/messages", icon: MessageSquare },
  { label: "Diário", path: "/diary", icon: Feather },
];

export function AppShell({
  campaigns,
  user,
  children,
}: {
  campaigns: NavCampaign[];
  user: SessionUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const currentId = pathname.split("/")[2];
  const campaign = campaigns.find((c) => c.id === currentId);
  const currentSection = campaign
    ? sections.find(
        (s) =>
          s.path && pathname.startsWith(`/campaigns/${campaign.id}${s.path}`),
      )
    : undefined;
  const dialog = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  function closeMenu() {
    dialog.current?.close();
  }
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (media.matches) dialog.current?.close();
    };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);
  function navigation(mobile = false) {
    return (
      <div className="sidebar-inner">
        <ArchiveBrand onNavigate={closeMenu} />
        <div className="sidebar-rule" />
        <nav aria-label={mobile ? "Navegação móvel" : "Navegação principal"}>
          <Link
            className="sidebar-link"
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={closeMenu}
          >
            <Library />
            <span>O grande acervo</span>
          </Link>
          {campaign && (
            <>
              <p className="sidebar-label">Neste volume</p>
              {sections.map(({ label, path, icon: Icon }) => {
                const href = `/campaigns/${campaign.id}${path}`;
                const active = path
                  ? pathname.startsWith(href)
                  : pathname === href;
                return (
                  <Link
                    key={path}
                    href={href}
                    className="sidebar-link"
                    aria-current={active ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    <Icon />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </>
          )}
          <p className="sidebar-label">
            As campanhas · {String(campaigns.length).padStart(2, "0")}
          </p>
          <div className="sidebar-campaigns">
            {campaigns.map((c, i) => (
              <Link
                key={c.id}
                href={`/campaigns/${c.id}`}
                className="sidebar-link sidebar-campaign-link"
                aria-current={
                  campaign?.id === c.id && pathname === `/campaigns/${c.id}`
                    ? "page"
                    : undefined
                }
                onClick={closeMenu}
              >
                <span className="nav-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{c.name}</span>
              </Link>
            ))}
            {campaigns.length === 0 && (
              <p className="px-3 text-xs text-[var(--ink-muted)]">
                Seu primeiro volume está por vir.
              </p>
            )}
          </div>
        </nav>
        <div className="sidebar-footer">
          <Link
            href="/campaigns/new"
            className="btn btn-secondary w-full"
            onClick={closeMenu}
          >
            <Plus />
            Nova campanha
          </Link>
          {user.role === "ADMIN" && (
            <Link href="/admin" className="sidebar-link admin-nav-link" onClick={closeMenu}>
              <Users />
              <span>Usuários & auditoria</span>
            </Link>
          )}
          <div className="account-row">
            <span className="account-avatar" aria-hidden="true">{user.username.slice(0, 1).toLocaleUpperCase("pt-BR")}</span>
            <span className="account-name">{user.username}<small>{user.role === "ADMIN" ? "Administrador" : "Conta"}</small></span>
            <form action={logout}><button className="account-logout" type="submit">Sair</button></form>
          </div>
          <p className="sidebar-colophon">
            Há histórias que merecem permanecer.
            <small>Memórias de nossas mesas</small>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="app-shell"
      data-campaign-theme={
        campaign?.name.toLocaleLowerCase("pt-BR").includes("strahd")
          ? "strahd"
          : campaign?.name.toLocaleLowerCase("pt-BR").includes("icewind")
            ? "icewind"
            : undefined
      }
    >
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <aside className="archive-sidebar">{navigation()}</aside>
      <dialog
        ref={dialog}
        id="archive-navigation-dialog"
        className="mobile-dialog"
        aria-label="Menu do acervo"
        onClose={() => setMenuOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) {
            const rect = dialog.current.getBoundingClientRect();
            if (e.clientX > rect.right) closeMenu();
          }
        }}
      >
        <button
          type="button"
          className="mobile-dialog-close"
          aria-label="Fechar menu"
          onClick={closeMenu}
        >
          <X size={20} />
        </button>
        {navigation(true)}
      </dialog>
      <div className="archive-main">
        <header className="archive-topbar">
          <div className="archive-mobile-brand">
            <ArchiveBrand />
          </div>
          <nav className="archive-breadcrumb" aria-label="Localização">
            <Link href="/">Acervo</Link>
            {campaign && (
              <>
                <ChevronRight size={12} />
                <Link href={`/campaigns/${campaign.id}`}>
                  <span>{campaign.name}</span>
                </Link>
              </>
            )}
            {currentSection && (
              <>
                <ChevronRight size={12} />
                <span aria-current="page">{currentSection.label}</span>
              </>
            )}
            {pathname === "/campaigns/new" && (
              <>
                <ChevronRight size={12} />
                <span>Nova campanha</span>
              </>
            )}
          </nav>
          <span className="archive-topbar-note">
            Histórias, relíquias & memórias
          </span>
          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Abrir menu"
            aria-haspopup="dialog"
            aria-controls="archive-navigation-dialog"
            aria-expanded={menuOpen}
            onClick={() => {
              dialog.current?.showModal();
              setMenuOpen(true);
            }}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </header>
        <main id="conteudo" className="archive-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
