export type SourceFocus =
  | "ai"
  | "programming"
  | "hackathon"
  | "startup"
  | "olympiad";

export type SourceOrganization =
  | "hub"
  | "university"
  | "government"
  | "company"
  | "federation";

export type TrackedSource = {
  id: string;
  name: string;
  url: string;
  eventsUrl: string;
  telegramUrl?: string;
  telegramHandle?: string;
  description: string;
  organization: SourceOrganization;
  focusAreas: SourceFocus[];
  /** Частота появления новых конкурсов */
  updateFrequency: "weekly" | "monthly" | "seasonal" | "annual";
  /** Открыты ли мероприятия для участников из любого региона/вуза */
  generallyOpen: boolean;
  notes: string;
};

export const organizationLabels: Record<SourceOrganization, string> = {
  hub: "Технопарк / IT-Хаб",
  university: "Университет",
  government: "Гос. программа / МЦРИАП",
  company: "IT-компания",
  federation: "Спортивная федерация",
};

export const frequencyLabels: Record<
  "weekly" | "monthly" | "seasonal" | "annual",
  string
> = {
  weekly: "Еженедельно",
  monthly: "Ежемесячно",
  seasonal: "Сезонно (осень/весна)",
  annual: "Ежегодно",
};
