"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, Search, SearchX } from "lucide-react";
import { Campaign } from "@/types";
import { CampaignCard } from "./CampaignCard";
import { EmptyState } from "@/components/shared/EmptyState";

type CollectionCampaign = Campaign & {
  _count: {
    characters: number;
    artworks: number;
    posts: number;
    messages: number;
    entries: number;
  };
};
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");

export function CampaignCollection({
  campaigns,
}: {
  campaigns: CollectionCampaign[];
}) {
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("");
  const [sort, setSort] = useState("recent");
  const systems = [...new Set(campaigns.map((c) => c.system))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  const filtered = campaigns
    .filter(
      (c) =>
        (!system || c.system === system) &&
        normalize(`${c.name} ${c.system} ${c.description}`).includes(
          normalize(query),
        ),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "pt-BR")
        : (sort === "oldest" ? 1 : -1) *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    );
  return (
    <>
      <div
        className="collection-toolbar"
        role="search"
        aria-label="Buscar campanhas"
      >
        <div className="search-field">
          <Search aria-hidden="true" />
          <label htmlFor="campaign-search" className="sr-only">
            Buscar no acervo
          </label>
          <input
            id="campaign-search"
            type="search"
            className="field"
            placeholder="Encontre uma campanha, uma aventura…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="toolbar-selects">
          <label className="sr-only" htmlFor="campaign-system">
            Sistema
          </label>
          <select
            id="campaign-system"
            className="field"
            value={system}
            onChange={(e) => setSystem(e.target.value)}
          >
            <option value="">Todos os sistemas</option>
            {systems.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="campaign-sort">
            Ordenar campanhas
          </label>
          <select
            id="campaign-sort"
            className="field"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recent">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
            <option value="name">Nome: A — Z</option>
          </select>
        </div>
      </div>
      <div className="section-label">
        <h2>Os volumes do acervo</h2>
        <span role="status">
          {filtered.length} {filtered.length === 1 ? "campanha" : "campanhas"}
        </span>
      </div>
      {filtered.length ? (
        <div className="campaign-grid">
          {filtered.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              index={campaigns.findIndex((original) => original.id === c.id)}
            />
          ))}
        </div>
      ) : campaigns.length ? (
        <EmptyState
          icon={SearchX}
          title="Nenhum volume encontrado"
          description="Tente outro nome ou remova os filtros para voltar ao acervo."
          action={
            <button
              className="btn btn-secondary"
              onClick={() => {
                setQuery("");
                setSystem("");
              }}
            >
              Limpar busca
            </button>
          }
        />
      ) : (
        <EmptyState
          icon={BookOpen}
          title="A primeira aventura começa aqui"
          description="Crie uma campanha e reserve um lugar para suas histórias, personagens e memórias."
          action={
            <Link href="/campaigns/new" className="btn btn-primary">
              <Plus />
              Criar campanha
            </Link>
          }
        />
      )}
    </>
  );
}
