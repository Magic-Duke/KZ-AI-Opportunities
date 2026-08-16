import type { Competition } from "@/types/competition";
import {
  categoryLabels,
  trustRatingLabels,
  formatLabels,
  entryBarrierLabels,
} from "@/types/competition";
import { trackedSources } from "@/data/sources";
import { ArrowUpRight, Check, Scale } from "lucide-react";

type CompetitionCardProps = {
  competition: Competition;
  isCompared?: boolean;
  onToggleCompare?: (competition: Competition) => void;
};

function formatDateRu(dateString?: string) {
  if (!dateString) return "Не подтверждён";
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDaysRemaining(deadlineStr?: string) {
  if (!deadlineStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(deadlineStr);
  deadline.setHours(23, 59, 59, 999);

  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function CompetitionCard({
  competition,
  isCompared = false,
  onToggleCompare,
}: CompetitionCardProps) {
  const source = trackedSources.find((item) => item.id === competition.sourceId);
  const daysLeft = getDaysRemaining(competition.deadline);
  const barrier = entryBarrierLabels[competition.entryBarrier];
  const trust = trustRatingLabels[competition.trustRating];
  const qualityLabel =
    competition.qualityStatus === "verified-hackathon"
      ? "Подтверждённый хакатон"
      : competition.qualityStatus === "verified-other-competition"
        ? "Проверенное соревнование"
        : "Требует проверки";

  return (
    <article
      className={`flex flex-col justify-between rounded border bg-white p-4 text-xs transition-colors ${
        isCompared
          ? "border-zinc-800 ring-1 ring-zinc-800"
          : "border-zinc-200/90 hover:border-zinc-300"
      }`}
    >
      <div>
        {/* Верхняя строка: Метки и переключатель сравнения */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-zinc-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
              {categoryLabels[competition.category]}
            </span>

            {competition.isLive && (
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 border border-zinc-200/60">
                Live
              </span>
            )}

            {competition.isAI && (
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
                AI
              </span>
            )}
            <span className={`rounded px-2 py-0.5 text-[11px] font-medium border ${
              competition.qualityStatus === "verified-hackathon"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}>
              {qualityLabel}
            </span>
          </div>

          {onToggleCompare && (
            <button
              type="button"
              onClick={() => onToggleCompare(competition)}
              className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-normal transition-colors cursor-pointer ${
                isCompared
                  ? "border-zinc-800 bg-zinc-800 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              }`}
            >
              {isCompared ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Выбрано</span>
                </>
              ) : (
                <>
                  <Scale className="h-3 w-3" />
                  <span>Сравнить</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Заголовок */}
        <h2 className="text-sm font-semibold leading-snug text-zinc-900">
          {competition.title}
        </h2>

        {/* Описание */}
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 line-clamp-2">
          {competition.description}
        </p>

        {/* Призовой фонд */}
        {competition.hasPrize && competition.prizeAmount && (
          <div className="mt-3 rounded bg-zinc-50 border border-zinc-200/80 px-2.5 py-1.5 text-xs">
            <span className="text-zinc-500 mr-1.5 font-normal">Фонд:</span>
            <span className="font-medium text-zinc-900">{competition.prizeAmount}</span>
          </div>
        )}

        {/* Список параметров */}
        <dl className="mt-3 space-y-1.5 text-xs border-t border-zinc-100 pt-2.5 text-zinc-600">
          <div className="flex justify-between">
            <dt className="text-zinc-400 font-normal">Дедлайн:</dt>
            <dd className="font-medium text-zinc-800">
              {formatDateRu(competition.deadline)}
              {daysLeft !== null && daysLeft >= 0 && (
                <span className="ml-1 text-zinc-400 font-normal">
                  ({daysLeft === 0 ? "сегодня" : `${daysLeft} дн.`})
                </span>
              )}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-zinc-400 font-normal">Формат / Город:</dt>
            <dd className="text-zinc-700 text-right truncate max-w-[170px]">
              {formatLabels[competition.format]} • {competition.location}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-zinc-400 font-normal">Порог входа:</dt>
            <dd className="text-zinc-700">{barrier.label}</dd>
          </div>

          {competition.teamRequirement && (
            <div className="flex justify-between">
              <dt className="text-zinc-400 font-normal">Команда:</dt>
              <dd className="text-zinc-700 truncate max-w-[170px] text-right">
                {competition.teamRequirement}
              </dd>
            </div>
          )}

          <div className="flex justify-between">
            <dt className="text-zinc-400 font-normal">Надежность:</dt>
            <dd className="text-zinc-700">{trust.label}</dd>
          </div>

          {source && (
            <div className="flex justify-between">
              <dt className="text-zinc-400 font-normal">Организатор:</dt>
              <dd className="text-zinc-700 text-right truncate max-w-[160px]">
                {source.name}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Кнопка регистрации */}
      <div className="mt-3.5 pt-2.5 border-t border-zinc-100">
        <a
          href={competition.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 py-2 text-xs font-normal text-white transition-colors"
        >
          <span>Страница события</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
        </a>
      </div>
    </article>
  );
}
