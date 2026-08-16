import type { Competition, EntryBarrier } from "@/types/competition";

type DevpostHackathon = {
  id: number;
  title: string;
  url: string;
  thumbnail_url?: string;
  submission_period_dates?: string;
  prize_amount?: string;
  open_state?: string;
  time_left_to_submission?: string;
  themes?: Array<{ id: number; name: string }>;
  managed_by_devpost?: boolean;
};

// Функция парсинга дедлайна из строки Devpost (например "May 19 - Aug 17, 2026" или "Aug 31, 2026")
function parseDevpostDeadline(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;

  // Если есть дефис, берем правую дату (дедлайн)
  const parts = dateStr.split("-");
  const targetStr = (parts[parts.length - 1] || "").trim();

  const parsed = new Date(targetStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return undefined;
}

// Извлечение суммы приза в USD и перевод в KZT (курс ~480 KZT за 1 USD)
function parsePrizeUSD(prizeHtml?: string): { text: string; valueKZT: number } | null {
  if (!prizeHtml) return null;
  const clean = prizeHtml.replace(/<[^>]+>/g, "").trim();
  const digits = clean.replace(/[^0-9]/g, "");
  if (!digits) return null;

  const usd = parseInt(digits, 10);
  if (isNaN(usd) || usd <= 0) return null;

  const kzt = usd * 480;
  const formattedUSD = `$${usd.toLocaleString("en-US")}`;
  const formattedKZT = `≈ ${(kzt / 1000000).toFixed(1)} млн ₸`;

  return {
    text: `${formattedUSD} (${formattedKZT})`,
    valueKZT: kzt,
  };
}

export async function fetchDevpostHackathons(): Promise<Competition[]> {
  try {
    const res = await fetch("https://devpost.com/api/hackathons?page=1", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 }, // Кэширование Next.js на 1 час
    });

    if (!res.ok) {
      console.warn("Devpost API responded with status:", res.status);
      return [];
    }

    const data = await res.json();
    const rawList: DevpostHackathon[] = data.hackathons || [];

    const competitions: Competition[] = rawList
      .filter((h) => h.open_state === "open" || !h.open_state)
      .map((h) => {
        const themeNames = (h.themes || []).map((t) => t.name);
        const isAI = themeNames.some(
          (t) =>
            t.toLowerCase().includes("ai") ||
            t.toLowerCase().includes("machine learning") ||
            t.toLowerCase().includes("data") ||
            h.title.toLowerCase().includes("ai") ||
            h.title.toLowerCase().includes("gemini") ||
            h.title.toLowerCase().includes("agent")
        );

        const prizeInfo = parsePrizeUSD(h.prize_amount);
        const deadline = parseDevpostDeadline(h.submission_period_dates);

        let entryBarrier: EntryBarrier = "medium";
        if (prizeInfo && prizeInfo.valueKZT > 50000000) {
          entryBarrier = "hard";
        } else if (!prizeInfo) {
          entryBarrier = "easy";
        }

        return {
          id: `devpost-${h.id || Math.abs(h.title.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0))}`,
          title: h.title,
          description: `Хакатон из специализированного каталога Devpost. Темы: ${themeNames.slice(0, 4).join(", ") || "Разработка сервисов и приложений"}. Условия участия проверяйте на странице события.`,
          category: "hackathon",
          region: "global",
          deadline,
          location: "Онлайн (Весь мир)",
          city: "online",
          format: "online",
          entryBarrier,
          url: h.url.startsWith("http") ? h.url : `https://devpost.com${h.url}`,
          sourceId: "devpost",
          isAI,
          hasPrize: !!prizeInfo,
          prizeAmount: prizeInfo ? prizeInfo.text : undefined,
          prizeValueKZT: prizeInfo ? prizeInfo.valueKZT : 0,
          audience: "everyone",
          trustRating: "high",
          trustNotes: "Devpost подтверждает тип события как хакатон; правила, доступность по странам и выплаты определяет конкретный организатор.",
          openToAll: false,
          tags: ["Devpost", "Online", ...themeNames.slice(0, 3), ...(isAI ? ["AI / ML"] : [])],
          isLive: true,
          sourceBadge: "⚡ Live Devpost",
          qualityStatus: "verified-hackathon",
          qualityReasons: ["dedicated-hackathon-catalog"],
        };
      });

    return competitions;
  } catch (error) {
    console.error("Error fetching Devpost hackathons:", error);
    return [];
  }
}
