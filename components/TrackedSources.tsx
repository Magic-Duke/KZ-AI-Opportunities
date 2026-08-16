"use client";

import { useState } from "react";
import { trackedSources } from "@/data/sources";
import { organizationLabels, frequencyLabels } from "@/types/source";

export default function TrackedSources() {
  const [activeOrg, setActiveOrg] = useState<string>("all");

  const filteredSources =
    activeOrg === "all"
      ? trackedSources
      : trackedSources.filter((s) => s.organization === activeOrg);

  return (
    <section className="mt-14 border-t border-zinc-200 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
            Отслеживаемые платформы и университеты
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-zinc-500 font-normal">
            Официальные площадки Казахстана (Astana Hub, КУ им. Ш. Уалиханова, КБТУ, SDU, NU) и международные платформы.
          </p>
        </div>

        {/* Фильтр по типу организации */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: "all", label: "Все" },
            { id: "university", label: "Вузы РК" },
            { id: "hub", label: "IT-хабы" },
            { id: "company", label: "Компании" },
            { id: "federation", label: "Федерации" },
          ].map((tab) => {
            const isActive = activeOrg === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveOrg(tab.id)}
                className={`rounded border px-2.5 py-1 text-xs font-normal transition-colors cursor-pointer ${
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
      </div>

      <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSources.map((source) => (
          <article
            key={source.id}
            className="flex flex-col justify-between rounded border border-zinc-200/90 bg-white p-4 text-xs font-normal hover:border-zinc-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h3 className="text-sm font-medium text-zinc-900">
                  {source.name}
                </h3>
                <span className="text-[11px] text-zinc-400">
                  {organizationLabels[source.organization]}
                </span>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">
                {source.description}
              </p>

              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-zinc-400">
                <span>Частота:</span>
                <span className="text-zinc-700 font-normal">
                  {frequencyLabels[source.updateFrequency]}
                </span>
              </div>

              <p className="mt-2 text-[11px] text-zinc-600 bg-zinc-50 rounded p-2 border border-zinc-100">
                {source.notes}
              </p>
            </div>

            <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-2.5 text-xs">
              <a
                href={source.eventsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              >
                Календарь событий ↗
              </a>

              {source.telegramUrl && (
                <a
                  href={source.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                >
                  {source.telegramHandle || "Telegram"} ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
