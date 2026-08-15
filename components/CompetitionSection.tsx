"use client";

import { useState, useMemo } from "react";
import { competitions } from "@/data/competitions";
import type {
  Competition,
  CompetitionCategory,
  CompetitionAudience,
  CompetitionTrustRating,
  CompetitionCity,
  CompetitionFormat,
  CompetitionRegion,
  EntryBarrier,
} from "@/types/competition";
import CategoryFilter from "@/components/CategoryFilter";
import CriteriaFilter from "@/components/CriteriaFilter";
import CompetitionCard from "@/components/CompetitionCard";

type SortOption = "deadline" | "prize" | "barrier_asc" | "barrier_desc" | "trust";

export default function CompetitionSection() {
  const [selectedRegion, setSelectedRegion] = useState<CompetitionRegion | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CompetitionCategory | "all"
  >("all");
  const [selectedCity, setSelectedCity] = useState<CompetitionCity | "all">("all");
  const [selectedFormat, setSelectedFormat] = useState<
    CompetitionFormat | "all"
  >("all");
  const [selectedBarrier, setSelectedBarrier] = useState<EntryBarrier | "all">(
    "all"
  );
  const [aiOnly, setAiOnly] = useState(false);
  const [withPrize, setWithPrize] = useState(false);
  const [openToAll, setOpenToAll] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<
    CompetitionAudience | "all"
  >("all");
  const [selectedTrust, setSelectedTrust] = useState<
    CompetitionTrustRating | "all"
  >("all");
  const [sortBy, setSortBy] = useState<SortOption>("deadline");
  const [showExpired, setShowExpired] = useState(false);

  // Фильтрация и сортировка
  const filteredCompetitions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return competitions
      .filter((competition) => {
        const deadlineDate = new Date(competition.deadline);
        deadlineDate.setHours(23, 59, 59, 999);
        const isExpired = deadlineDate.getTime() < today.getTime();

        // По умолчанию скрываем прошедшие конкурсы
        if (!showExpired && isExpired) {
          return false;
        }

        // Фильтр по региону (Казахстан / Мировые)
        if (selectedRegion !== "all" && competition.region !== selectedRegion) {
          return false;
        }

        // Поиск по ключевым словам
        if (searchQuery.trim() !== "") {
          const query = searchQuery.toLowerCase();
          const matchTitle = competition.title.toLowerCase().includes(query);
          const matchDesc = competition.description.toLowerCase().includes(query);
          const matchLocation = competition.location.toLowerCase().includes(query);
          const matchTags = competition.tags?.some((t) =>
            t.toLowerCase().includes(query)
          );

          if (!matchTitle && !matchDesc && !matchLocation && !matchTags) {
            return false;
          }
        }

        // Фильтр по городу (только для КЗ или онлайн)
        if (selectedCity !== "all") {
          if (selectedCity === "online") {
            if (competition.city !== "online" && competition.format !== "online") {
              return false;
            }
          } else if (competition.city !== selectedCity && competition.city !== "online") {
            return false;
          }
        }

        // Фильтр по формату (онлайн / очно / гибрид)
        if (selectedFormat !== "all") {
          if (selectedFormat === "online" && competition.format !== "online") {
            return false;
          }
          if (selectedFormat === "offline" && competition.format !== "offline") {
            return false;
          }
          if (selectedFormat === "hybrid" && competition.format !== "hybrid") {
            return false;
          }
        }

        // Фильтр по порогу входа
        if (selectedBarrier !== "all" && competition.entryBarrier !== selectedBarrier) {
          return false;
        }

        // Категория
        if (
          selectedCategory !== "all" &&
          competition.category !== selectedCategory
        ) {
          return false;
        }

        // Только ИИ
        if (aiOnly && !competition.isAI) {
          return false;
        }

        // С призовым фондом
        if (withPrize && !competition.hasPrize) {
          return false;
        }

        // Открыто для всех
        if (openToAll && !competition.openToAll) {
          return false;
        }

        // Аудитория (школьники / студенты / стартапы)
        if (
          selectedAudience !== "all" &&
          competition.audience !== selectedAudience &&
          competition.audience !== "everyone"
        ) {
          return false;
        }

        // Рейтинг организатора
        if (
          selectedTrust !== "all" &&
          competition.trustRating !== selectedTrust
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Сортировка по дедлайну
        if (sortBy === "deadline") {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        // Сортировка по сумме призового фонда
        if (sortBy === "prize") {
          const prizeA = a.prizeValueKZT || 0;
          const prizeB = b.prizeValueKZT || 0;
          return prizeB - prizeA;
        }
        // Сортировка по порогу входа (легкие сначала)
        if (sortBy === "barrier_asc") {
          const barrierWeight: Record<EntryBarrier, number> = {
            easy: 1,
            medium: 2,
            hard: 3,
          };
          return barrierWeight[a.entryBarrier] - barrierWeight[b.entryBarrier];
        }
        // Сортировка по порогу входа (сложные/стартапы сначала)
        if (sortBy === "barrier_desc") {
          const barrierWeight: Record<EntryBarrier, number> = {
            easy: 1,
            medium: 2,
            hard: 3,
          };
          return barrierWeight[b.entryBarrier] - barrierWeight[a.entryBarrier];
        }
        // Сортировка по рейтингу организатора
        if (sortBy === "trust") {
          const ratingWeight: Record<CompetitionTrustRating, number> = {
            high: 3,
            medium: 2,
            new: 1,
          };
          return ratingWeight[b.trustRating] - ratingWeight[a.trustRating];
        }
        return 0;
      });
  }, [
    selectedRegion,
    searchQuery,
    selectedCategory,
    selectedCity,
    selectedFormat,
    selectedBarrier,
    aiOnly,
    withPrize,
    openToAll,
    selectedAudience,
    selectedTrust,
    sortBy,
    showExpired,
  ]);

  const hasActiveFilters =
    selectedRegion !== "all" ||
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedCity !== "all" ||
    selectedFormat !== "all" ||
    selectedBarrier !== "all" ||
    aiOnly ||
    withPrize ||
    openToAll ||
    selectedAudience !== "all" ||
    selectedTrust !== "all";

  const resetFilters = () => {
    setSelectedRegion("all");
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCity("all");
    setSelectedFormat("all");
    setSelectedBarrier("all");
    setAiOnly(false);
    setWithPrize(false);
    setOpenToAll(false);
    setSelectedAudience("all");
    setSelectedTrust("all");
  };

  const kzCount = competitions.filter((c) => c.region === "kz").length;
  const globalCount = competitions.filter((c) => c.region === "global").length;

  return (
    <section>
      {/* Главный переключатель регионов: Казахстан / Мировые */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200/80 pb-4">
        {[
          { id: "all", label: `Все площадки (${competitions.length})`, icon: "🔥" },
          { id: "kz", label: `🇰🇿 Казахстанские события (${kzCount})`, icon: "🇰🇿" },
          { id: "global", label: `🌎 Мировые платформы (${globalCount})`, icon: "🌎" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedRegion(tab.id as CompetitionRegion | "all")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedRegion === tab.id
                ? "bg-slate-900 text-white shadow-md ring-2 ring-slate-900/20"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Поисковая строка и расширенная сортировка */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Поиск: Kaggle, Codeforces, Devpost, Кокшетау, Астана, Алматы, LLM, Python..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/90 bg-white py-3 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-hidden focus:ring-3 focus:ring-blue-50/80 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Очистить ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
            Сортировка:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 focus:border-blue-400 focus:outline-hidden cursor-pointer shadow-2xs"
          >
            <option value="deadline">⏳ Ближайший дедлайн</option>
            <option value="prize">💰 Крупнейший призовой фонд</option>
            <option value="barrier_asc">🟢 Порог входа: Сначала простые</option>
            <option value="barrier_desc">🔴 Порог входа: Сначала сложные</option>
            <option value="trust">🏆 По рейтингу организатора</option>
          </select>
        </div>
      </div>

      {/* Блок фильтров с мягким фоном */}
      <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xs p-5 shadow-2xs">
        <div>
          <h2 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            Категория соревнований
          </h2>
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        <div>
          <h2 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            Параметры, города и форматы
          </h2>
          <CriteriaFilter
            aiOnly={aiOnly}
            withPrize={withPrize}
            openToAll={openToAll}
            selectedCity={selectedCity}
            selectedFormat={selectedFormat}
            selectedBarrier={selectedBarrier}
            selectedAudience={selectedAudience}
            selectedTrust={selectedTrust}
            onAiOnlyChange={setAiOnly}
            onWithPrizeChange={setWithPrize}
            onOpenToAllChange={setOpenToAll}
            onCityChange={setSelectedCity}
            onFormatChange={setSelectedFormat}
            onBarrierChange={setSelectedBarrier}
            onAudienceChange={setSelectedAudience}
            onTrustChange={setSelectedTrust}
          />
        </div>
      </div>

      {/* Панель результатов и переключатель Архива */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <p className="text-xs sm:text-sm font-medium text-slate-700">
            Найдено соревнований:{" "}
            <span className="font-bold text-slate-900">
              {filteredCompetitions.length}
            </span>{" "}
            из {competitions.length}
          </p>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              Сбросить все фильтры
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showExpired}
            onChange={(e) => setShowExpired(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-400"
          />
          <span>Показывать архив завершенных конкурсов</span>
        </label>
      </div>

      {/* Список карточек */}
      {filteredCompetitions.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300/80 p-12 text-center bg-white shadow-2xs">
          <p className="text-3xl mb-3">🔍</p>
          <h3 className="text-base font-bold text-slate-900">
            По выбранным фильтрам ничего не найдено
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Попробуйте выбрать «Все площадки» или сбросить критерии.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompetitions.map((competition) => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
        </div>
      )}
    </section>
  );
}
