import { describe, expect, it } from "vitest";
import {
  classifyCompetition,
  getCompetitionQuality,
  isStrictHackathon,
} from "./competitionQuality";

describe("classifyCompetition", () => {
  it("rejects an educational intensive even when it mentions a technology", () => {
    const result = classifyCompetition({
      title: "Solana Create — офлайн-интенсив по блокчейну и AI",
      description: "Интенсив по созданию и запуску продуктов на блокчейне Solana.",
    });

    expect(result.status).toBe("rejected");
    expect(result.reasons).toContain("educational-event");
  });

  it("accepts an explicitly named hackathon with a build deliverable and judging", () => {
    const result = classifyCompetition({
      title: "AI for Cities Hackathon",
      description:
        "Команды 2–5 человек за 48 часов создают прототип. Жюри оценивает решения, победители получат призы.",
    });

    expect(result.status).toBe("verified-hackathon");
    expect(result.type).toBe("hackathon");
  });

  it("keeps a pitch competition out of the strict hackathon feed", () => {
    const result = classifyCompetition({
      title: "Female Founders Pitch Competition",
      description: "Отбор и презентация стартапов перед экспертным жюри.",
    });

    expect(result.status).toBe("verified-other-competition");
    expect(result.type).toBe("startup");
  });

  it("marks a loosely described challenge for manual verification", () => {
    const result = classifyCompetition({
      title: "Smart City Challenge",
      description: "Приглашаем участников на открытое событие.",
    });

    expect(result.status).toBe("needs-review");
  });

  it("trusts Devpost's dedicated hackathon catalog without inventing eligibility", () => {
    const result = getCompetitionQuality({
      sourceId: "devpost",
      isLive: true,
      title: "Build with Gemini XPRIZE",
      description: "A competition on the Devpost hackathons catalog.",
    });

    expect(result.status).toBe("verified-hackathon");
    expect(result.reasons).toContain("dedicated-hackathon-catalog");
  });

  it("does not put an unverified Solana event in the strict feed", () => {
    const quality = getCompetitionQuality({
      sourceId: "astana-hub",
      title: "Solana Create",
      description: "От идеи до работающего продукта.",
    });

    expect(isStrictHackathon(quality.status, undefined)).toBe(false);
  });
});
