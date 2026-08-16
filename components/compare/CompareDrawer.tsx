"use client";

import type { Competition } from "@/types/competition";
import { Scale, X } from "lucide-react";

type CompareDrawerProps = {
  selectedItems: Competition[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpenModal: () => void;
};

export default function CompareDrawer({
  selectedItems,
  onRemove,
  onClear,
  onOpenModal,
}: CompareDrawerProps) {
  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 w-[92%] max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-white text-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-[11px] font-medium text-zinc-300">
            {selectedItems.length}
          </span>
          <span className="font-normal text-zinc-200">
            Сравнение соревнований
          </span>

          <div className="hidden sm:flex flex-wrap gap-1 max-w-xs overflow-hidden">
            {selectedItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300 border border-zinc-700"
              >
                <span className="max-w-[100px] truncate">{item.title}</span>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="text-zinc-400 hover:text-white cursor-pointer transition-colors text-xs"
          >
            Сбросить
          </button>

          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center gap-1 rounded bg-white hover:bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-900 transition-colors cursor-pointer"
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Сравнить ({selectedItems.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
