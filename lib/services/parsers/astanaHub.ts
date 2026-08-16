import type {
  Competition,
  EntryBarrier,
  CompetitionCategory,
  CompetitionCity,
  CompetitionFormat,
} from "@/types/competition";
import { getCompetitionQuality } from "@/lib/services/competitionQuality";

export async function fetchAstanaHubEvents(): Promise<Competition[]> {
  try {
    const res = await fetch("https://astanahub.com/ru/event/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn("Astana Hub events response status:", res.status);
      return [];
    }

    const html = await res.text();
    const shareMatches = [...html.matchAll(/openShareModal\('([^']+)',\s*'([^']+)'\)/g)];
    const events: Competition[] = [];
    const seenTitles = new Set<string>();
    const seenUrls = new Set<string>();

    for (const m of shareMatches) {
      const url = m[1];
      const rawTitle = m[2].trim();

      // Нормализованный заголовок для дедупликации
      const normalizedTitle = rawTitle.toLowerCase().replace(/[^a-zа-я0-9]/gi, "");
      if (seenTitles.has(normalizedTitle) || seenUrls.has(url)) continue;

      const pos = html.indexOf(m[0]);
      const chunk = html.slice(pos, pos + 1200);

      const descMatch =
        chunk.match(/class="card-item--description[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
        chunk.match(/<p class="paragraph">([\s\S]*?)<\/p>/i);
      const desc = descMatch
        ? descMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
        : "";

      const textToAnalyze = `${rawTitle} ${url} ${desc}`.toLowerCase();

      const quality = getCompetitionQuality({
        title: rawTitle,
        description: desc,
        sourceId: "astana-hub",
      });
      if (quality.status === "rejected") continue;

      seenTitles.add(normalizedTitle);
      seenUrls.add(url);

      // Определение локации
      let city: CompetitionCity = "online";
      let location = "Онлайн (Казахстан)";
      let format: CompetitionFormat = "online";

      if (textToAnalyze.includes("zhambyl") || textToAnalyze.includes("жамбыл") || textToAnalyze.includes("тараз")) {
        city = "other";
        location = "Тараз (Zhambyl Hub)";
        format = "offline";
      } else if (textToAnalyze.includes("batys") || textToAnalyze.includes("батыс") || textToAnalyze.includes("уральск")) {
        city = "other";
        location = "Уральск (Batys Hub)";
        format = "offline";
      } else if (textToAnalyze.includes("jetisu") || textToAnalyze.includes("жетісу") || textToAnalyze.includes("талдыкорган")) {
        city = "other";
        location = "Талдыкорган (Jetisu Digital)";
        format = "offline";
      } else if (textToAnalyze.includes("pavlodar") || textToAnalyze.includes("павлодар")) {
        city = "other";
        location = "Павлодар (Pavlodar Hub)";
        format = "offline";
      } else if (textToAnalyze.includes("aqtobe") || textToAnalyze.includes("актобе")) {
        city = "other";
        location = "Актобе (Aqtobe Hub)";
        format = "offline";
      } else if (textToAnalyze.includes("atyrau") || textToAnalyze.includes("атырау")) {
        city = "other";
        location = "Атырау (Atyrau Hub)";
        format = "offline";
      } else if (textToAnalyze.includes("караганда") || textToAnalyze.includes("karaganda") || textToAnalyze.includes("terricon")) {
        city = "other";
        location = "Караганда (Terricon Hub)";
        format = "offline";
      } else if (textToAnalyze.includes("кокшетау") || textToAnalyze.includes("kokshetau")) {
        city = "kokshetau";
        location = "Кокшетау";
        format = "offline";
      } else if (textToAnalyze.includes("алматы") || textToAnalyze.includes("almaty")) {
        city = "almaty";
        location = "Алматы";
        format = "offline";
      } else if (textToAnalyze.includes("астана") || textToAnalyze.includes("astana")) {
        city = "astana";
        location = "Астана (Astana Hub)";
        format = "offline";
      } else if (textToAnalyze.includes("офлайн") || textToAnalyze.includes("offline")) {
        format = "offline";
        location = "Офлайн (Казахстан)";
      }

      if (textToAnalyze.includes("гибрид") || textToAnalyze.includes("онлайн + офлайн")) {
        format = "hybrid";
      }

      // Категория
      const titleLower = rawTitle.toLowerCase();
      const isAI =
        titleLower.includes("ai") ||
        titleLower.includes("ии") ||
        titleLower.includes("искусствен") ||
        textToAnalyze.includes("ai") ||
        textToAnalyze.includes("нейро") ||
        textToAnalyze.includes("искусствен") ||
        textToAnalyze.includes("gpt") ||
        textToAnalyze.includes("llm") ||
        textToAnalyze.includes("генератив");

      let category: CompetitionCategory = "hackathon";
      if (
        titleLower.includes("battle") ||
        titleLower.includes("батл") ||
        titleLower.includes("стартап") ||
        titleLower.includes("startup") ||
        titleLower.includes("питч") ||
        titleLower.includes("pitch") ||
        titleLower.includes("founders")
      ) {
        category = "startup";
      } else if (
        titleLower.includes("олимпиад") ||
        titleLower.includes("olympiad")
      ) {
        category = "olympiad";
      } else if (
        titleLower.includes("программир") ||
        titleLower.includes("code") ||
        titleLower.includes("разработк")
      ) {
        category = "programming";
      } else if (isAI) {
        category = "ai";
      }

      let entryBarrier: EntryBarrier = "medium";
      if (category === "startup" || titleLower.includes("battle")) {
        entryBarrier = "medium";
      } else if (category === "olympiad") {
        entryBarrier = "hard";
      }

      events.push({
        id: `ah-${url.split("/").filter(Boolean).pop() || Math.random().toString(36).substring(7)}`,
        title: rawTitle,
        description:
          desc ||
          `Официальная стартап-битва / хакатон Astana Hub. Открыта регистрация проектов и команд с прямым финансированием и менторством.`,
        category,
        region: "kz",
        // Каталог не публикует единый дедлайн в карточке; не подменяем его
        // вымышленной датой. Такие события не попадают в строгую выдачу.
        deadline: undefined,
        location,
        city,
        format,
        entryBarrier,
        url,
        sourceId: "astana-hub",
        isAI,
        hasPrize: false,
        audience: category === "startup" ? "startups" : "everyone",
        trustRating: "high",
        trustNotes: "Событие опубликовано в календаре Astana Hub. Условия участия, сроки и призы подтверждаются только на детальной странице.",
        openToAll: false,
        tags: [
          "Astana Hub",
          "Казахстан",
          location.split(" ")[0],
          ...(isAI ? ["AI", "ИИ"] : []),
          category === "startup" ? "Стартапы" : "Хакатон",
        ],
        isLive: true,
        sourceBadge: "🇰🇿 Live Astana Hub",
        qualityStatus: quality.status,
        qualityReasons: quality.reasons,
      });
    }

    return events;
  } catch (error) {
    console.error("Error fetching live Astana Hub competitions:", error);
    return [];
  }
}
