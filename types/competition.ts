export type CompetitionCategory =
  | "ai"
  | "programming"
  | "hackathon"
  | "olympiad"
  | "startup";

export type CompetitionAudience =
  | "everyone"
  | "students"
  | "school"
  | "startups";

export type CompetitionRegion =
  | "kz"      // Казахстан 🇰🇿
  | "global";  // Мировые платформы 🌎 (доступные для жителей РК)

export type CompetitionTrustRating =
  | "high"    // Официальный / Сертифицированный (Astana Hub, CPFED, Codeforces, Kaggle, Вузы)
  | "medium"  // Проверенный
  | "new";    // Новый

/** How confidently the event itself was classified, independently of its organizer. */
export type CompetitionQualityStatus =
  | "verified-hackathon"
  | "verified-other-competition"
  | "needs-review"
  | "rejected";

export type CompetitionCity =
  | "astana"
  | "almaty"
  | "kokshetau"
  | "other"
  | "online";

export type CompetitionFormat =
  | "online"   // Только удаленно
  | "offline"  // Личное очное присутствие
  | "hybrid";  // Онлайн + очный финал

export type EntryBarrier =
  | "easy"     // Простая регистрация (для новичков, без жестких требований)
  | "medium"   // Средний (нужны базовые навыки, формирование команды, разработка прототипа)
  | "hard";    // Высокий (готовый MVP/стартап, сложная олимпиадная математика или DS)

export type Competition = {
  id: string;
  title: string;
  description: string;
  category: CompetitionCategory;
  region: CompetitionRegion;
  /** Confirmed registration deadline. Never guessed when the source omits it. */
  deadline?: string; // Формат YYYY-MM-DD
  location: string;
  city: CompetitionCity;
  format: CompetitionFormat;
  entryBarrier: EntryBarrier;
  /** Прямая ссылка на страницу условий / регистрации / расписания */
  url: string;
  sourceId: string;
  isAI: boolean;
  hasPrize: boolean;
  prizeAmount?: string;
  prizeValueKZT?: number; // Числовой эквивалент в тенге для точной сортировки
  audience: CompetitionAudience;
  trustRating: CompetitionTrustRating;
  trustNotes?: string;
  openToAll: boolean;
  tags?: string[];
  /** Флаг получения данных в реальном времени через API */
  isLive?: boolean;
  /** Текстовая плашка источника (например '⚡ Live Devpost', '⚡ Live Codeforces', '🇰🇿 Astana Hub') */
  sourceBadge?: string;
  /** Формат команды (например '1–4 человека', 'Только индивидуально', 'Команда до 5 чел.') */
  teamRequirement?: string;
  /** Conservative result of the event-quality classifier. */
  qualityStatus?: CompetitionQualityStatus;
  /** Human-readable reasons used to classify the event. */
  qualityReasons?: string[];
};

export const regionLabels: Record<CompetitionRegion | "all", string> = {
  all: "Все соревнования (КЗ + Мир)",
  kz: "🇰🇿 Казахстан",
  global: "🌎 Мировые платформы",
};

export const categoryLabels: Record<CompetitionCategory | "all", string> = {
  all: "Все направления",
  ai: "ИИ & Data Science",
  hackathon: "Хакатоны",
  programming: "Спортивное программирование",
  olympiad: "Олимпиады",
  startup: "Стартап-битвы & Питчи",
};

export const audienceLabels: Record<CompetitionAudience, string> = {
  everyone: "Для всех желающих",
  students: "Студенты вузов/колледжей",
  school: "Школьники",
  startups: "Стартапы & Команды",
};

export const cityLabels: Record<CompetitionCity | "all", string> = {
  all: "Все города",
  astana: "Астана",
  almaty: "Алматы",
  kokshetau: "Кокшетау",
  other: "Другие города",
  online: "Онлайн (Вся РК / Мир)",
};

export const formatLabels: Record<CompetitionFormat | "all", string> = {
  all: "Любой формат",
  online: "🌐 Онлайн",
  offline: "🏢 Очно (Личное участие)",
  hybrid: "🔄 Гибрид",
};

export const entryBarrierLabels: Record<
  EntryBarrier | "all",
  { label: string; badge: string; color: string; description: string }
> = {
  all: {
    label: "Любой порог",
    badge: "Любой",
    color: "bg-slate-100 text-slate-700",
    description: "Любой уровень подготовки",
  },
  easy: {
    label: "🟢 Легкий порог (Только регистрация)",
    badge: "🟢 Легкий старт",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    description: "Простая подача заявки, подходит новичкам",
  },
  medium: {
    label: "🟡 Средний порог (Команда / MVP)",
    badge: "🟡 Средний уровень",
    color: "bg-amber-50 text-amber-800 border-amber-200/80",
    description: "Требуются базовые навыки кодинга/ML или разработка прототипа",
  },
  hard: {
    label: "🔴 Высокий порог (Готовый проект / Hard)",
    badge: "🔴 Высокий порог",
    color: "bg-rose-50 text-rose-800 border-rose-200/80",
    description: "Требуется готовый MVP/стартап или глубокие олимпиадные алгоритмы",
  },
};

export const trustRatingLabels: Record<
  CompetitionTrustRating,
  { label: string; badge: string; color: string; description: string }
> = {
  high: {
    label: "Высокий рейтинг",
    badge: "🏆 Высокий рейтинг",
    color: "bg-emerald-50/90 text-emerald-800 border-emerald-200/80",
    description: "Сертифицированный организатор (мировая платформа, гос. хаб, вуз), 100% гарантия выплат",
  },
  medium: {
    label: "Проверенный",
    badge: "⭐ Проверенный",
    color: "bg-blue-50/90 text-blue-800 border-blue-200/80",
    description: "Проводился 2-3 раза, есть подтвержденные кейсы и выплаты призов",
  },
  new: {
    label: "Новый конкурс",
    badge: "❓ Новый организатор",
    color: "bg-amber-50/90 text-amber-800 border-amber-200/80",
    description: "Проводится впервые, история выплат еще формируется",
  },
};
