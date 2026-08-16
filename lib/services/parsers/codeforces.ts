import type { Competition, EntryBarrier } from "@/types/competition";

type CodeforcesContest = {
  id: number;
  name: string;
  type: string;
  phase: "BEFORE" | "CODING" | "PENDING_SYSTEM_TEST" | "SYSTEM_TEST" | "FINISHED";
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
};

export async function fetchCodeforcesContests(): Promise<Competition[]> {
  try {
    const res = await fetch("https://codeforces.com/api/contest.list?gym=false", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      next: { revalidate: 1800 }, // Кэширование на 30 минут
    });

    if (!res.ok) {
      console.warn("Codeforces API status:", res.status);
      return [];
    }

    const data = await res.json();
    if (data.status !== "OK" || !Array.isArray(data.result)) {
      return [];
    }

    const rawList: CodeforcesContest[] = data.result;

    // Не выдаем завершённые раунды за актуальные события.
    const activeContests = rawList
      .filter((c) => c.phase === "BEFORE" && c.startTimeSeconds)
      .slice(0, 6);

    const competitions: Competition[] = activeContests.map((c) => {
      const startDate = new Date(c.startTimeSeconds! * 1000);
      const deadline = startDate.toISOString().split("T")[0];
      const dateString = startDate.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });

      const isDiv1 = c.name.includes("Div. 1");
      const isDiv2 = c.name.includes("Div. 2");
      const isDiv3 = c.name.includes("Div. 3");
      const isDiv4 = c.name.includes("Div. 4");

      let entryBarrier: EntryBarrier = "easy";
      if (isDiv1) entryBarrier = "hard";
      else if (isDiv2) entryBarrier = "medium";
      else if (isDiv3 || isDiv4) entryBarrier = "easy";

      const durationHours = (c.durationSeconds / 3600).toFixed(1);

      return {
        id: `cf-${c.id}`,
        title: c.name,
        description: `Официальный рейтинговый раунд на Codeforces. Длительность: ${durationHours} ч. Старт: ${dateString}. Автоматическое изменение рейтинга, разбор задач и открытые тесты.`,
        category: "programming",
        region: "global",
        deadline,
        location: "Онлайн (Весь мир)",
        city: "online",
        format: "online",
        entryBarrier,
        url: `https://codeforces.com/contest/${c.id}`,
        sourceId: "codeforces",
        isAI: false,
        hasPrize: false,
        audience: "everyone",
        trustRating: "high",
        trustNotes: "Официальная международная рейтинговая платформа Codeforces. Открыто для всех зарегистрированных пользователей.",
        openToAll: true,
        tags: ["Codeforces", "Алгоритмы", "Рейтинг", "Спортивное программирование"],
        isLive: true,
        sourceBadge: "⚡ Live Codeforces",
        teamRequirement: "Индивидуальное участие (Solo)",
        qualityStatus: "verified-other-competition",
        qualityReasons: ["dedicated-programming-contest-catalog"],
      };
    });

    return competitions;
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error);
    return [];
  }
}
