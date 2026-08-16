"use client";

import type {
  CompetitionAudience,
  CompetitionTrustRating,
  CompetitionCity,
  CompetitionFormat,
  EntryBarrier,
} from "@/types/competition";

type CriteriaFilterProps = {
  aiOnly: boolean;
  withPrize: boolean;
  openToAll: boolean;
  selectedCity: CompetitionCity | "all";
  selectedFormat: CompetitionFormat | "all";
  selectedBarrier: EntryBarrier | "all";
  selectedAudience: CompetitionAudience | "all";
  selectedTrust: CompetitionTrustRating | "all";
  onAiOnlyChange: (value: boolean) => void;
  onWithPrizeChange: (value: boolean) => void;
  onOpenToAllChange: (value: boolean) => void;
  onCityChange: (value: CompetitionCity | "all") => void;
  onFormatChange: (value: CompetitionFormat | "all") => void;
  onBarrierChange: (value: EntryBarrier | "all") => void;
  onAudienceChange: (value: CompetitionAudience | "all") => void;
  onTrustChange: (value: CompetitionTrustRating | "all") => void;
};

export default function CriteriaFilter({
  aiOnly,
  withPrize,
  openToAll,
  selectedCity,
  selectedFormat,
  selectedBarrier,
  selectedAudience,
  selectedTrust,
  onAiOnlyChange,
  onWithPrizeChange,
  onOpenToAllChange,
  onCityChange,
  onFormatChange,
  onBarrierChange,
  onAudienceChange,
  onTrustChange,
}: CriteriaFilterProps) {
  return (
    <div className="space-y-3 text-xs font-normal">
      {/* 1. Города проведения */}
      <div>
        <span className="block mb-1.5 text-zinc-500 font-normal">
          Локация (РК)
        </span>
        <div className="flex flex-wrap gap-1">
          {[
            { id: "all", label: "Все" },
            { id: "astana", label: "Астана" },
            { id: "almaty", label: "Алматы" },
            { id: "kokshetau", label: "Кокшетау" },
            { id: "online", label: "Онлайн" },
            { id: "other", label: "Другие города" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onCityChange(item.id as CompetitionCity | "all")}
              className={`rounded border px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                selectedCity === item.id
                  ? "border-zinc-800 bg-zinc-800 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Формат и Порог входа */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <span className="block mb-1.5 text-zinc-500 font-normal">
            Формат участия
          </span>
          <div className="flex flex-wrap gap-1">
            {[
              { id: "all", label: "Любой" },
              { id: "online", label: "Онлайн" },
              { id: "offline", label: "Очно" },
              { id: "hybrid", label: "Гибрид" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onFormatChange(item.id as CompetitionFormat | "all")
                }
                className={`rounded border px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                  selectedFormat === item.id
                    ? "border-zinc-800 bg-zinc-800 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block mb-1.5 text-zinc-500 font-normal">
            Порог входа
          </span>
          <div className="flex flex-wrap gap-1">
            {[
              { id: "all", label: "Любой" },
              { id: "easy", label: "Легкий" },
              { id: "medium", label: "Средний (MVP)" },
              { id: "hard", label: "Сложный" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onBarrierChange(item.id as EntryBarrier | "all")
                }
                className={`rounded border px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                  selectedBarrier === item.id
                    ? "border-zinc-800 bg-zinc-800 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Чекбоксы отбора */}
      <div className="flex flex-wrap gap-4 pt-1 border-t border-zinc-200/60">
        <label className="flex items-center gap-1.5 cursor-pointer select-none text-zinc-700">
          <input
            type="checkbox"
            checked={aiOnly}
            onChange={(e) => onAiOnlyChange(e.target.checked)}
            className="rounded border-zinc-300 text-zinc-700 focus:ring-zinc-700"
          />
          <span>ИИ и нейросети</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer select-none text-zinc-700">
          <input
            type="checkbox"
            checked={withPrize}
            onChange={(e) => onWithPrizeChange(e.target.checked)}
            className="rounded border-zinc-300 text-zinc-700 focus:ring-zinc-700"
          />
          <span>С призовым фондом</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer select-none text-zinc-700">
          <input
            type="checkbox"
            checked={openToAll}
            onChange={(e) => onOpenToAllChange(e.target.checked)}
            className="rounded border-zinc-300 text-zinc-700 focus:ring-zinc-700"
          />
          <span>Открыто для всех</span>
        </label>
      </div>

      {/* 4. Аудитория и рейтинг */}
      <div className="grid gap-3 sm:grid-cols-2 pt-1 border-t border-zinc-200/60">
        <div>
          <span className="block mb-1.5 text-zinc-500 font-normal">
            Аудитория
          </span>
          <div className="flex flex-wrap gap-1">
            {[
              { id: "all", label: "Все" },
              { id: "students", label: "Студенты" },
              { id: "school", label: "Школьники" },
              { id: "startups", label: "Стартапы" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onAudienceChange(item.id as CompetitionAudience | "all")
                }
                className={`rounded border px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                  selectedAudience === item.id
                    ? "border-zinc-800 bg-zinc-800 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block mb-1.5 text-zinc-500 font-normal">
            Рейтинг источника
          </span>
          <div className="flex flex-wrap gap-1">
            {[
              { id: "all", label: "Любой" },
              { id: "high", label: "Высокий" },
              { id: "medium", label: "Проверенные" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onTrustChange(item.id as CompetitionTrustRating | "all")
                }
                className={`rounded border px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                  selectedTrust === item.id
                    ? "border-zinc-800 bg-zinc-800 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
