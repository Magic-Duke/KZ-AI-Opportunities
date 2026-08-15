"use client";

import type { CompetitionCategory } from "@/types/competition";
import { categoryLabels } from "@/types/competition";

type CategoryFilterProps = {
  selected: CompetitionCategory | "all";
  onChange: (category: CompetitionCategory | "all") => void;
};

const categories: (CompetitionCategory | "all")[] = [
  "all",
  "ai",
  "hackathon",
  "programming",
  "olympiad",
  "startup",
];

export default function CategoryFilter({
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = selected === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
              isActive
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {categoryLabels[category]}
          </button>
        );
      })}
    </div>
  );
}
