"use client";

import { useEffect } from "react";
import type { Competition } from "@/types/competition";
import {
  categoryLabels,
  formatLabels,
  entryBarrierLabels,
  trustRatingLabels,
  audienceLabels,
} from "@/types/competition";
import { X, ArrowUpRight } from "lucide-react";

type CompareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: Competition[];
  onRemove: (id: string) => void;
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

function getDaysRemaining(deadlineStr?: string): number | null {
  if (!deadlineStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineStr);
  deadline.setHours(23, 59, 59, 999);
  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function CompareModal({
  isOpen,
  onClose,
  items,
  onRemove,
}: CompareModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded border border-zinc-300 bg-white overflow-hidden">
        {/* Шапка */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5 bg-zinc-50">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Сравнение соревнований ({items.length})
            </h2>
            <p className="text-xs text-zinc-500 font-normal">
              Параметры участия, требования и ссылки на регистрацию
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded border border-zinc-300 bg-white text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Таблица */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-5 bg-white">
          <div
            className="grid gap-3.5 min-w-[640px]"
            style={{
              gridTemplateColumns: `repeat(${items.length}, minmax(200px, 1fr))`,
            }}
          >
            {items.map((item) => {
              const barrier = entryBarrierLabels[item.entryBarrier];
              const trust = trustRatingLabels[item.trustRating];
              const daysLeft = getDaysRemaining(item.deadline);

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded border border-zinc-200 bg-zinc-50/50 p-4 text-xs font-normal"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/60">
                      <span className="font-medium text-zinc-600">
                        {categoryLabels[item.category]}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
                      >
                        Убрать
                      </button>
                    </div>

                    <h3 className="text-sm font-medium text-zinc-900 leading-snug">
                      {item.title}
                    </h3>

                    {/* Параметры */}
                    <div className="mt-3 space-y-2.5">
                      <div>
                        <span className="text-zinc-400 block font-normal">Призовой фонд:</span>
                        <span className="font-medium text-zinc-800">
                          {item.hasPrize && item.prizeAmount ? item.prizeAmount : "Без денежного фонда"}
                        </span>
                      </div>

                      <div>
                        <span className="text-zinc-400 block font-normal">Дедлайн:</span>
                        <span className="font-medium text-zinc-800">
                          {formatDateRu(item.deadline)}
                          {daysLeft !== null && daysLeft >= 0 && (
                            <span className="ml-1 text-zinc-400 font-normal">
                              ({daysLeft} дн.)
                            </span>
                          )}
                        </span>
                      </div>

                      <div>
                        <span className="text-zinc-400 block font-normal">Порог входа:</span>
                        <span className="text-zinc-700">{barrier.label}</span>
                      </div>

                      <div>
                        <span className="text-zinc-400 block font-normal">Формат и город:</span>
                        <span className="text-zinc-700">
                          {formatLabels[item.format]} • {item.location}
                        </span>
                      </div>

                      <div>
                        <span className="text-zinc-400 block font-normal">Участие:</span>
                        <span className="text-zinc-700">
                          {item.teamRequirement || "Любой формат"}
                        </span>
                      </div>

                      <div>
                        <span className="text-zinc-400 block font-normal">Аудитория:</span>
                        <span className="text-zinc-700">
                          {audienceLabels[item.audience]}
                        </span>
                      </div>

                      <div>
                        <span className="text-zinc-400 block font-normal">Надежность:</span>
                        <span className="text-zinc-700">{trust.label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 font-normal text-white transition-colors"
                    >
                      <span>Страница события</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Футер */}
        <div className="flex items-center justify-end border-t border-zinc-200 px-5 py-2.5 bg-zinc-50">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-300 bg-white px-3 py-1 text-xs font-normal text-zinc-700 hover:bg-zinc-50 cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
