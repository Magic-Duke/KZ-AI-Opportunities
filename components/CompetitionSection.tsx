"use client";

import { useState, useMemo, useEffect } from "react";
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
import CompareDrawer from "@/components/compare/CompareDrawer";
import CompareModal from "@/components/compare/CompareModal";
import { Search, RefreshCw } from "lucide-react";
import { isStrictHackathon } from "@/lib/services/competitionQuality";

type SortOption = "deadline" | "prize" | "barrier_asc" | "barrier_desc" | "trust";

export default function CompetitionSection() {
  const [dataList, setDataList] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [sourceCounts, setSourceCounts] = useState<{
    kzLive?: number;
    kzFlagship?: number;
    kz?: number;
    devpost: number;
    codeforces: number;
    total: number;
  }>({
    kz: 0,
    devpost: 0,
    codeforces: 0,
    total: 0,
  });

  const [selectedForCompare, setSelectedForCompare] = useState<Competition[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

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
  const [strictHackathonsOnly, setStrictHackathonsOnly] = useState(true);

  useEffect(() => {
    async function loadLiveData() {
      try {
        const res = await fetch("/api/competitions");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setDataList(json.data);
            if (json.lastUpdated) {
              setLastSyncTime(new Date(json.lastUpdated).toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              }));
            }
            if (json.counts) {
              setSourceCounts(json.counts);
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch verified competitions:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLiveData();
  }, []);

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      if (res.ok) {
        const compRes = await fetch("/api/competitions?refresh=true");
        const compJson = await compRes.json();
        if (compJson.success && Array.isArray(compJson.data)) {
          setDataList(compJson.data);
          setLastSyncTime(new Date().toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }));
          if (compJson.counts) setSourceCounts(compJson.counts);
        }
      }
    } catch (err) {
      console.error("Force sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleCompare = (competition: Competition) => {
    setSelectedForCompare((prev) => {
      const isAlreadySelected = prev.some((c) => c.id === competition.id);
      if (isAlreadySelected) {
        return prev.filter((c) => c.id !== competition.id);
      }
      if (prev.length >= 4) {
        alert("Можно выбрать максимум 4 конкурса для одновременного сравнения.");
        return prev;
      }
      return [...prev, competition];
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setSelectedForCompare((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearCompare = () => {
    setSelectedForCompare([]);
  };

  const filteredCompetitions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dataList
      .filter((competition) => {
        if (strictHackathonsOnly && !isStrictHackathon(competition.qualityStatus, competition.deadline)) {
          return false;
        }

        const deadlineDate = competition.deadline ? new Date(competition.deadline) : null;
        deadlineDate?.setHours(23, 59, 59, 999);
        const isExpired = deadlineDate ? deadlineDate.getTime() < today.getTime() : false;

        if (!showExpired && isExpired) {
          return false;
        }

        if (selectedRegion !== "all" && competition.region !== selectedRegion) {
          return false;
        }

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

        if (selectedCity !== "all") {
          if (selectedCity === "online") {
            if (competition.city !== "online" && competition.format !== "online") {
              return false;
            }
          } else if (competition.city !== selectedCity && competition.city !== "online") {
            return false;
          }
        }

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

        if (selectedBarrier !== "all" && competition.entryBarrier !== selectedBarrier) {
          return false;
        }

        if (
          selectedCategory !== "all" &&
          competition.category !== selectedCategory
        ) {
          return false;
        }

        if (aiOnly && !competition.isAI) {
          return false;
        }

        if (withPrize && !competition.hasPrize) {
          return false;
        }

        if (openToAll && !competition.openToAll) {
          return false;
        }

        if (
          selectedAudience !== "all" &&
          competition.audience !== selectedAudience &&
          competition.audience !== "everyone"
        ) {
          return false;
        }

        if (
          selectedTrust !== "all" &&
          competition.trustRating !== selectedTrust
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "deadline") {
          const deadlineA = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
          const deadlineB = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
          return deadlineA - deadlineB;
        }
        if (sortBy === "prize") {
          const prizeA = a.prizeValueKZT || 0;
          const prizeB = b.prizeValueKZT || 0;
          return prizeB - prizeA;
        }
        if (sortBy === "barrier_asc") {
          const barrierWeight: Record<EntryBarrier, number> = {
            easy: 1,
            medium: 2,
            hard: 3,
          };
          return barrierWeight[a.entryBarrier] - barrierWeight[b.entryBarrier];
        }
        if (sortBy === "barrier_desc") {
          const barrierWeight: Record<EntryBarrier, number> = {
            easy: 1,
            medium: 2,
            hard: 3,
          };
          return barrierWeight[b.entryBarrier] - barrierWeight[a.entryBarrier];
        }
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
    dataList,
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
    strictHackathonsOnly,
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
    setStrictHackathonsOnly(true);
  };

  const kzCount = dataList.filter((c) => c.region === "kz").length;
  const globalCount = dataList.filter((c) => c.region === "global").length;

  return (
    <section>
      {/* Статус-панель синхронизации */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded border border-zinc-200/80 bg-zinc-100/50 px-3.5 py-2.5 text-xs text-zinc-600 font-normal">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-zinc-800 font-medium">
            <span className="h-2 w-2 rounded-full bg-zinc-500"></span>
            <span>Синхронизация:</span>
          </span>
          <span>
            Казахстан: {kzCount} • Devpost: {sourceCounts.devpost || 9} • Codeforces: {sourceCounts.codeforces || 6}
          </span>
          {lastSyncTime && (
            <span className="text-zinc-400">
              ({lastSyncTime})
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleForceSync}
          disabled={isSyncing}
          className="inline-flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin text-zinc-500" : ""}`} />
          <span>{isSyncing ? "Обновление..." : "Обновить"}</span>
        </button>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded border border-emerald-200 bg-emerald-50/60 px-3.5 py-2.5 text-xs text-emerald-900">
        <div>
          <span className="font-medium">
            {strictHackathonsOnly ? "Строгая выдача включена." : "Показаны все типы событий."}
          </span>{" "}
          {strictHackathonsOnly
            ? "Показываем только хакатоны с подтверждённым типом и дедлайном. Обучающие события, питчи и записи без срока скрыты."
            : "Неподтверждённые сроки и условия помечены в карточках — проверяйте их на странице организатора."}
        </div>
        <button
          type="button"
          onClick={() => setStrictHackathonsOnly((value) => !value)}
          className="shrink-0 rounded border border-emerald-300 bg-white px-2.5 py-1 text-xs font-medium text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          {strictHackathonsOnly ? "Показать все типы" : "Только хакатоны"}
        </button>
      </div>

      {/* Вкладки регионов */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {[
          { id: "all", label: `Все площадки (${dataList.length})` },
          { id: "kz", label: `Казахстан (${kzCount})` },
          { id: "global", label: `Мировые платформы (${globalCount})` },
        ].map((tab) => {
          const isActive = selectedRegion === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedRegion(tab.id as CompetitionRegion | "all")}
              className={`rounded border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? "border-zinc-800 bg-zinc-800 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Поиск и сортировка */}
      <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Поиск по названию, городу, технологиям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-xs text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400 font-normal whitespace-nowrap">
            Сортировка:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 focus:border-zinc-400 focus:outline-hidden cursor-pointer"
          >
            <option value="deadline">Ближайший дедлайн</option>
            <option value="prize">Размер призового фонда</option>
            <option value="barrier_asc">Порог входа: Сначала простые</option>
            <option value="barrier_desc">Порог входа: Сначала сложные</option>
            <option value="trust">Рейтинг организатора</option>
          </select>
        </div>
      </div>

      {/* Блок фильтров */}
      <div className="space-y-4 rounded border border-zinc-200/80 bg-zinc-50/70 p-4 mb-6">
        <div>
          <span className="block mb-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Категория
          </span>
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        <div>
          <span className="block mb-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Параметры
          </span>
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

      {/* Результаты и архив */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-3 mb-5">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-500 font-normal">
            Найдено: <span className="text-zinc-800 font-medium">{filteredCompetitions.length}</span> из {dataList.length}
          </span>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-zinc-400 hover:text-zinc-800 underline cursor-pointer"
            >
              Сбросить фильтры
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer">
          <input
            type="checkbox"
            checked={showExpired}
            onChange={(e) => setShowExpired(e.target.checked)}
            className="rounded border-zinc-300 text-zinc-800 focus:ring-zinc-700"
          />
          <span>Показывать завершенные</span>
        </label>
      </div>

      {/* Список карточек */}
      {isLoading ? (
        <div className="rounded border border-dashed border-zinc-200 p-8 text-center bg-zinc-50">
          <p className="text-xs text-zinc-500">Проверяем источники и условия участия…</p>
        </div>
      ) : filteredCompetitions.length === 0 ? (
        <div className="rounded border border-dashed border-zinc-200 p-8 text-center bg-zinc-50">
          <p className="text-xs text-zinc-500">
            По выбранным фильтрам подтверждённых событий не найдено.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 text-xs text-zinc-700 hover:underline cursor-pointer"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompetitions.map((competition) => {
            const isCompared = selectedForCompare.some((c) => c.id === competition.id);
            return (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                isCompared={isCompared}
                onToggleCompare={handleToggleCompare}
              />
            );
          })}
        </div>
      )}

      {/* Панель и модалка сравнения */}
      <CompareDrawer
        selectedItems={selectedForCompare}
        onRemove={handleRemoveFromCompare}
        onClear={handleClearCompare}
        onOpenModal={() => setIsCompareModalOpen(true)}
      />

      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        items={selectedForCompare}
        onRemove={handleRemoveFromCompare}
      />
    </section>
  );
}
