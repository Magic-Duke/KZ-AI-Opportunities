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
    <div className="flex flex-wrap gap-1.5">
      {categories.map((category) => {
        const isActive = selected === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded border px-2.5 py-1 text-xs font-normal transition-colors cursor-pointer ${
              isActive
                ? "border-zinc-800 bg-zinc-800 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-zinc-900"
            }`}
          >
            {categoryLabels[category]}
          </button>
        );
      })}
    </div>
  );
}
