import type { Competition } from "@/types/competition";
import {
  audienceLabels,
  categoryLabels,
  trustRatingLabels,
  formatLabels,
  entryBarrierLabels,
} from "@/types/competition";
import { trackedSources } from "@/data/sources";

type CompetitionCardProps = {
  competition: Competition;
};

// Функция для форматирования даты на русском
function formatDateRu(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Расчет оставшихся дней и статуса дедлайна с мягкими цветами
function getDeadlineInfo(deadlineStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(deadlineStr);
  deadline.setHours(23, 59, 59, 999);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: "expired",
      label: "Завершено",
      badgeClass: "bg-slate-100 text-slate-500 border-slate-200",
    };
  }
  if (diffDays === 0) {
    return {
      status: "urgent",
      label: "🔥 Сегодня последний день!",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200 font-semibold animate-pulse",
    };
  }
  if (diffDays === 1) {
    return {
      status: "urgent",
      label: "🔥 Остался 1 день!",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200 font-medium",
    };
  }
  if (diffDays <= 7) {
    return {
      status: "urgent",
      label: `🔥 Осталось ${diffDays} дн.`,
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200 font-medium",
    };
  }
  if (diffDays <= 30) {
    return {
      status: "active",
      label: `⏳ Осталось ${diffDays} дн.`,
      badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    };
  }
  return {
    status: "open",
    label: "🟢 Регистрация открыта",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const source = trackedSources.find((item) => item.id === competition.sourceId);
  const deadlineInfo = getDeadlineInfo(competition.deadline);
  const trustInfo = trustRatingLabels[competition.trustRating];
  const barrierInfo = entryBarrierLabels[competition.entryBarrier];

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
      <div>
        {/* Верхняя строка: Индикатор дедлайна + Рейтинг надежности */}
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${deadlineInfo.badgeClass}`}
          >
            {deadlineInfo.label}
          </span>

          <span
            title={trustInfo.description}
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${trustInfo.color}`}
          >
            {trustInfo.badge}
          </span>
        </div>

        {/* Теги категорий, формата и порога входа */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200/60">
            {categoryLabels[competition.category]}
          </span>

          {/* Формат участия */}
          <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 border border-blue-100">
            {formatLabels[competition.format]}
          </span>

          {/* Порог входа */}
          <span
            title={barrierInfo.description}
            className={`rounded-lg px-2 py-1 text-xs font-medium border ${barrierInfo.color}`}
          >
            {barrierInfo.badge}
          </span>

          {competition.isAI && (
            <span className="rounded-lg bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 border border-purple-100">
              🤖 ИИ
            </span>
          )}

          {competition.audience === "school" && (
            <span className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 border border-sky-100">
              🎒 Школьники
            </span>
          )}

          {competition.audience === "students" && (
            <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 border border-indigo-100">
              🎓 Студенты
            </span>
          )}

          {competition.audience === "startups" && (
            <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 border border-amber-100">
              🚀 Стартапы
            </span>
          )}
        </div>

        {/* Заголовок карточки */}
        <h2 className="mb-2 text-lg font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors">
          {competition.title}
        </h2>

        {/* Описание */}
        <p className="mb-4 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-3">
          {competition.description}
        </p>

        {/* Призовой фонд */}
        {competition.hasPrize && competition.prizeAmount && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50/70 border border-amber-200/60 px-3 py-2 text-amber-900">
            <span className="text-sm">💰</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Приз:
            </span>
            <span className="text-xs sm:text-sm font-bold text-amber-900">
              {competition.prizeAmount}
            </span>
          </div>
        )}

        {/* Детали соревнований */}
        <dl className="mb-4 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center justify-between border-t border-slate-100 pt-2">
            <dt className="text-slate-400">📅 Окончание приема:</dt>
            <dd className="font-semibold text-slate-800">
              {formatDateRu(competition.deadline)}
            </dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-slate-400">📍 Локация:</dt>
            <dd className="font-medium text-slate-700">{competition.location}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-slate-400">🎯 Аудитория:</dt>
            <dd className="font-medium text-slate-700">
              {audienceLabels[competition.audience]}
            </dd>
          </div>

          {source && (
            <div className="flex items-center justify-between">
              <dt className="text-slate-400">🏢 Организатор / Вуз:</dt>
              <dd className="font-medium text-slate-700">{source.name}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Кнопка перехода к регистрации */}
      <div className="mt-2 pt-3 border-t border-slate-100">
        <a
          href={competition.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-medium text-white transition-all hover:bg-slate-800 hover:shadow-xs active:scale-[0.99]"
        >
          <span>Официальная регистрация</span>
          <span className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
        </a>
      </div>
    </article>
  );
}
