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

type ToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  icon: string;
  onChange: (value: boolean) => void;
};

function Toggle({ label, description, checked, icon, onChange }: ToggleProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all select-none ${
        checked
          ? "border-blue-400 bg-blue-50/70 shadow-2xs"
          : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"
      />
      <div>
        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-900">
          <span>{icon}</span> {label}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
      </div>
    </label>
  );
}

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
    <div className="space-y-4">
      {/* 1. Фильтр по городам (Астана, Алматы, Кокшетау, Другие, Онлайн) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          🏙️ Фильтр по городам
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "Все города" },
            { id: "astana", label: "🇰🇿 Астана" },
            { id: "almaty", label: "🍎 Алматы" },
            { id: "kokshetau", label: "🌲 Кокшетау" },
            { id: "online", label: "🌐 Онлайн (Вся РК)" },
            { id: "other", label: "📍 Другие города" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onCityChange(item.id as CompetitionCity | "all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedCity === item.id
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100/90 text-slate-700 hover:bg-slate-200/80"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Формат участия (Онлайн / Офлайн / Гибрид) + Порог входа */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Формат */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            📍 Формат участия
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "Любой" },
              { id: "online", label: "🌐 Только Онлайн" },
              { id: "offline", label: "🏢 Очно (Личное присутствие)" },
              { id: "hybrid", label: "🔄 Гибрид" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onFormatChange(item.id as CompetitionFormat | "all")
                }
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  selectedFormat === item.id
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100/90 text-slate-700 hover:bg-slate-200/80"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Порог входа */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            🪜 Порог входа в конкурс
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "Любой" },
              { id: "easy", label: "🟢 Простая регистрация" },
              { id: "medium", label: "🟡 Команда / MVP" },
              { id: "hard", label: "🔴 Готовый проект / Hard" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onBarrierChange(item.id as EntryBarrier | "all")
                }
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  selectedBarrier === item.id
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100/90 text-slate-700 hover:bg-slate-200/80"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Быстрые критерии (ИИ, Приз, Открыто) */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Toggle
          icon="🤖"
          label="Только ИИ и нейросети"
          description="LLM, AI-боты, Computer Vision, ML"
          checked={aiOnly}
          onChange={onAiOnlyChange}
        />
        <Toggle
          icon="💰"
          label="С призовым фондом"
          description="Денежные призы, гранты или инвестиции"
          checked={withPrize}
          onChange={onWithPrizeChange}
        />
        <Toggle
          icon="🌍"
          label="Открыто для всех"
          description="Без ограничений по вузу или городу"
          checked={openToAll}
          onChange={onOpenToAllChange}
        />
      </div>

      {/* 4. Селекторы целевой аудитории и рейтинга */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            🎯 Целевая аудитория
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "Любая" },
              { id: "students", label: "🎓 Студенты вузов" },
              { id: "school", label: "🎒 Школьники" },
              { id: "startups", label: "🚀 Стартапы" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onAudienceChange(item.id as CompetitionAudience | "all")
                }
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  selectedAudience === item.id
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100/90 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            🛡️ Рейтинг надежности организатора
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "Любой рейтинг" },
              { id: "high", label: "🏆 Высокий (Сертифицированный)" },
              { id: "medium", label: "⭐ Проверенные" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onTrustChange(item.id as CompetitionTrustRating | "all")
                }
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  selectedTrust === item.id
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100/90 text-slate-600 hover:bg-slate-200/80"
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
