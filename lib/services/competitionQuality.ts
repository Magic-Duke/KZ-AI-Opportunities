import type { CompetitionQualityStatus } from "@/types/competition";

export type { CompetitionQualityStatus } from "@/types/competition";

export type CompetitionKind = "hackathon" | "startup" | "competition" | "unknown";

export type CompetitionClassification = {
  status: CompetitionQualityStatus;
  type: CompetitionKind;
  reasons: string[];
  evidenceCount: number;
};

type CompetitionCandidate = {
  title: string;
  description?: string;
  sourceId?: string;
  isLive?: boolean;
};

const EDUCATIONAL_PATTERNS = [
  /\bboot\s*camp\b/i,
  /\bworkshop\b/i,
  /\bwebinar\b/i,
  /\bmeetup\b/i,
  /\bintensive\b/i,
  /\bcourse\b/i,
  /\btraining\b/i,
  /буткемп/i,
  /интенсив/i,
  /курс(?:ы|а|е|ов|ом)?/i,
  /воркшоп/i,
  /вебинар/i,
  /лекци/i,
  /митап/i,
  /мастер[- ]?класс/i,
  /обучени/i,
];

const HACKATHON_PATTERN = /\bhackathon\b|хакатон/i;
const STARTUP_PATTERN = /\bpitch\b|питч|\bstartup\b|стартап|founders/i;
const COMPETITION_PATTERN = /\bcompetition\b|конкурс|чемпионат|олимпиад|\bdatathon\b|дататон/i;

const EVIDENCE_PATTERNS = [
  /прототип|mvp|prototype|build|созда[тй]|разработа[тй]/i,
  /команд[аы]|team|участник[аиов]*\s+в\s+команде/i,
  /жюри|judg(?:e|ing)|оцен[иок]|критери[йя]/i,
  /приз(?:ы|овой)|prize|award|\$\s*\d|₸/i,
  /дедлайн|submission|подать|подач[аи]|\b24\s*(?:час|hour)|\b48\s*(?:час|hour)/i,
];

function getEvidenceCount(text: string): number {
  return EVIDENCE_PATTERNS.filter((pattern) => pattern.test(text)).length;
}

/**
 * Keeps the public feed conservative: a name alone is never enough to call an
 * event a hackathon. Educational events are rejected before positive matches.
 */
export function classifyCompetition(
  candidate: CompetitionCandidate
): CompetitionClassification {
  const text = `${candidate.title} ${candidate.description ?? ""}`.trim();
  const evidenceCount = getEvidenceCount(text);

  if (EDUCATIONAL_PATTERNS.some((pattern) => pattern.test(text))) {
    return {
      status: "rejected",
      type: "unknown",
      reasons: ["educational-event"],
      evidenceCount,
    };
  }

  if (HACKATHON_PATTERN.test(text) && evidenceCount >= 2) {
    return {
      status: "verified-hackathon",
      type: "hackathon",
      reasons: ["explicit-hackathon", "sufficient-competition-evidence"],
      evidenceCount,
    };
  }

  if (STARTUP_PATTERN.test(text)) {
    return {
      status: "verified-other-competition",
      type: "startup",
      reasons: ["startup-or-pitch-event"],
      evidenceCount,
    };
  }

  if (COMPETITION_PATTERN.test(text) && evidenceCount >= 1) {
    return {
      status: "verified-other-competition",
      type: "competition",
      reasons: ["explicit-competition"],
      evidenceCount,
    };
  }

  return {
    status: "needs-review",
    type: "unknown",
    reasons: ["insufficient-hackathon-evidence"],
    evidenceCount,
  };
}

/**
 * A dedicated, named hackathon catalogue can confirm the event type, but it
 * does not prove country eligibility, prizes, or team rules. Those fields must
 * still come from the event page.
 */
export function getCompetitionQuality(
  candidate: CompetitionCandidate
): CompetitionClassification {
  if (candidate.sourceId === "devpost" && candidate.isLive) {
    return {
      status: "verified-hackathon",
      type: "hackathon",
      reasons: ["dedicated-hackathon-catalog"],
      evidenceCount: 1,
    };
  }

  if (candidate.sourceId === "codeforces") {
    return {
      status: "verified-other-competition",
      type: "competition",
      reasons: ["dedicated-programming-contest-catalog"],
      evidenceCount: 1,
    };
  }

  return classifyCompetition(candidate);
}

export function isStrictHackathon(
  qualityStatus: CompetitionQualityStatus | undefined,
  deadline: string | undefined
): boolean {
  return qualityStatus === "verified-hackathon" && Boolean(deadline);
}
