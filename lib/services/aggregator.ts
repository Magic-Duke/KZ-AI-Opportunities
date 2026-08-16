import type { Competition } from "@/types/competition";
import { fetchDevpostHackathons } from "./parsers/devpost";
import { fetchCodeforcesContests } from "./parsers/codeforces";
import { fetchAstanaHubEvents } from "./parsers/astanaHub";
import { kzRealCompetitions } from "./parsers/kzEcosystem";
import { getCompetitionQuality } from "./competitionQuality";

type AggregatedResult = {
  competitions: Competition[];
  lastUpdated: string;
  sourceCounts: {
    kzLive: number;
    kzFlagship: number;
    devpost: number;
    codeforces: number;
    total: number;
  };
};

let memoryCache: AggregatedResult | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 минут

function withQualityMetadata(competition: Competition): Competition | null {
  if (competition.qualityStatus === "rejected") return null;

  if (competition.qualityStatus) return competition;

  const quality = getCompetitionQuality(competition);
  if (quality.status === "rejected") return null;

  return {
    ...competition,
    qualityStatus: quality.status,
    qualityReasons: quality.reasons,
  };
}

export async function getAggregatedCompetitions(
  forceRefresh = false
): Promise<AggregatedResult> {
  const now = Date.now();

  if (!forceRefresh && memoryCache && now - lastFetchTime < CACHE_TTL_MS) {
    return memoryCache;
  }

  // Запуск всех 3 парсеров параллельно с изоляцией ошибок
  const [ahResult, devpostResult, cfResult] = await Promise.allSettled([
    fetchAstanaHubEvents(),
    fetchDevpostHackathons(),
    fetchCodeforcesContests(),
  ]);

  const liveAstanaHub =
    ahResult.status === "fulfilled" ? ahResult.value : [];
  const liveDevpost =
    devpostResult.status === "fulfilled" ? devpostResult.value : [];
  const liveCF = cfResult.status === "fulfilled" ? cfResult.value : [];

  // Объединение потоков с фильтрацией дубликатов по URL и ID
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const uniqueCompetitions: Competition[] = [];

  const rawList: Competition[] = [
    ...liveAstanaHub,
    ...kzRealCompetitions,
    ...liveDevpost,
    ...liveCF,
  ];

  for (const rawCompetition of rawList) {
    const comp = withQualityMetadata(rawCompetition);
    if (!comp) continue;

    if (!seenIds.has(comp.id) && !seenUrls.has(comp.url)) {
      seenIds.add(comp.id);
      seenUrls.add(comp.url);
      uniqueCompetitions.push(comp);
    }
  }

  // Сортировка: сначала ближайшие активные дедлайны
  const sorted = uniqueCompetitions.sort((a, b) => {
    const deadlineA = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
    const deadlineB = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
    return deadlineA - deadlineB;
  });

  const result: AggregatedResult = {
    competitions: sorted,
    lastUpdated: new Date().toISOString(),
    sourceCounts: {
      kzLive: liveAstanaHub.length,
      kzFlagship: kzRealCompetitions.length,
      devpost: liveDevpost.length,
      codeforces: liveCF.length,
      total: sorted.length,
    },
  };

  memoryCache = result;
  lastFetchTime = now;

  return result;
}
