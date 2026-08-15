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
    <section className="mt-16 border-t border-slate-200/80 pt-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200/80">
            📡 Официальный мониторинг вузов и технопарков
          </span>
          <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
            Отслеживаемые университеты и IT-площадки Казахстана
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-600">
            Платформы, региональные IT-хабы и университеты (включая КУ им. Ш. Уалиханова в Кокшетау,
            КБТУ, МУИТ и NU), где регулярно проводятся открытые хакатоны и стартап-конкурсы.
          </p>
        </div>

        {/* Быстрый фильтр по типу организации */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
          {[
            { id: "all", label: "Все источники" },
            { id: "university", label: "🎓 Вузы РК" },
            { id: "hub", label: "🏢 IT-хабы" },
            { id: "company", label: "💼 Компании" },
            { id: "federation", label: "🏆 Федерации" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveOrg(tab.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                activeOrg === tab.id
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSources.map((source) => (
          <article
            key={source.id}
            className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] transition-all ${
              source.id === "ualikhanov-university" || source.id === "aqmola-hub"
                ? "border-emerald-200/80 bg-emerald-50/10"
                : "border-slate-200/90"
            }`}
          >
            <div>
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {source.name}
                </h3>
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200/50">
                  {organizationLabels[source.organization]}
                </span>
              </div>

              <p className="text-xs leading-relaxed text-slate-600">
                {source.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Частота:</span>
                <span>{frequencyLabels[source.updateFrequency]}</span>
              </div>

              <p className="mt-2.5 text-xs text-slate-500 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                📌 {source.notes}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs">
              <a
                href={source.eventsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 font-medium text-slate-800 transition-colors"
              >
                📅 Страница событий ↗
              </a>

              {source.telegramUrl && (
                <a
                  href={source.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl bg-sky-50 hover:bg-sky-100 px-3 py-1.5 font-medium text-sky-700 transition-colors"
                >
                  💬 {source.telegramHandle || "Telegram"} ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
