import { describe, it, expect } from "vitest";
import { 
  resolveCopy, 
  getIntentFromKeywords,
  SERVICE_NAMES, 
  FAQ_DEFAULT, 
  BULLETS_DEFAULT,
  TRUST_BLOCKS,
  HERO_VARIANTS,
  CREDENTIALS,
  type IntentType
} from "./copySystem";

describe("copySystem", () => {
  describe("resolveCopy", () => {
    it("returns all required fields", () => {
      const result = resolveCopy({});
      
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("h1");
      expect(result).toHaveProperty("subhead");
      expect(result).toHaveProperty("offer");
      expect(result).toHaveProperty("bullets");
      expect(result).toHaveProperty("ctaLabel");
      expect(result).toHaveProperty("ctaMicrocopy");
      expect(result).toHaveProperty("ctaSecondaryLabel");
      expect(result).toHaveProperty("trustBlock");
      expect(result).toHaveProperty("faq");
      expect(result).toHaveProperty("answerBlock");
    });

    it("returns non-empty strings for all text fields", () => {
      const result = resolveCopy({});
      
      expect(result.title.length).toBeGreaterThan(0);
      expect(result.description.length).toBeGreaterThan(0);
      expect(result.h1.length).toBeGreaterThan(0);
      expect(result.offer.length).toBeGreaterThan(0);
      expect(result.ctaLabel.length).toBeGreaterThan(0);
    });

    it("returns bullets array with items", () => {
      const result = resolveCopy({});
      
      expect(Array.isArray(result.bullets)).toBe(true);
      expect(result.bullets.length).toBeGreaterThan(0);
    });

    it("returns FAQ array with question/answer objects", () => {
      const result = resolveCopy({});
      
      expect(Array.isArray(result.faq)).toBe(true);
      expect(result.faq.length).toBeGreaterThan(0);
      expect(result.faq[0]).toHaveProperty("question");
      expect(result.faq[0]).toHaveProperty("answer");
    });

    it("uses provided service name in title", () => {
      const result = resolveCopy({ service: "огнезащита цеха" });
      
      expect(result.title.toLowerCase()).toContain("огнезащита цеха");
    });

    it("detects price intent from query", () => {
      const result = resolveCopy({ query: "сколько стоит огнезащита" });
      
      expect(result.h1.toLowerCase()).toMatch(/смета|расчёт|кп/);
    });

    it("detects urgent intent from query", () => {
      const result = resolveCopy({ query: "нужно срочно сделать работы" });
      
      expect(result.h1.toLowerCase()).toMatch(/срочн/);
    });

    it("detects single contractor intent from query", () => {
      const result = resolveCopy({ query: "огнезащита под ключ" });
      
      expect(result.h1.toLowerCase()).toMatch(/один подрядчик|договор/);
    });

    it("detects fireproof intent from query", () => {
      const result = resolveCopy({ query: "огнезащита R60" });
      
      expect(result.h1.toLowerCase()).toMatch(/огнезащит/);
    });

    it("detects geo intent from query and extracts city", () => {
      const result = resolveCopy({ query: "услуги в Екатеринбурге" });
      
      expect(result.h1).toContain("Екатеринбург");
    });

    it("applies explicit intent override", () => {
      const result = resolveCopy({ intent: "price" });
      
      expect(result.h1.toLowerCase()).toMatch(/смета|расчёт/);
    });

    it("uses city in geo context", () => {
      const result = resolveCopy({ 
        intent: "geo", 
        city: "Екатеринбург",
        service: "антикоррозия"
      });
      
      expect(result.h1).toContain("Екатеринбург");
    });

    it("returns different CTAs for different intents", () => {
      const priceResult = resolveCopy({ intent: "price" });
      const urgentResult = resolveCopy({ intent: "urgent" });
      
      expect(priceResult.ctaLabel).not.toBe(urgentResult.ctaLabel);
    });

    it("returns default trust block", () => {
      const result = resolveCopy({});
      
      expect(result.trustBlock).toContain("документ");
    });
  });

  describe("getIntentFromKeywords", () => {
    it("returns price intent for price keywords", () => {
      const intent = getIntentFromKeywords("стоимость огнезащита");
      
      expect(intent).toBe("price");
    });

    it("returns fireproof intent for R-class keywords", () => {
      const intent = getIntentFromKeywords("R60 металлоконструкции");
      
      expect(intent).toBe("fireproof");
    });

    it("returns lep intent for ЛЭП keywords", () => {
      const intent = getIntentFromKeywords("работы на ЛЭП");
      
      expect(intent).toBe("lep");
    });

    it("returns ams intent for АМС keywords", () => {
      const intent = getIntentFromKeywords("работы на АМС");
      
      expect(intent).toBe("ams");
    });

    it("returns stack intent for труба keywords", () => {
      const intent = getIntentFromKeywords("покраска дымовой трубы");
      
      expect(intent).toBe("stack");
    });

    it("returns default for non-matching keywords", () => {
      const intent = getIntentFromKeywords("что-то другое");
      
      expect(intent).toBe("default");
    });
  });

  describe("HERO_VARIANTS", () => {
    it("has all 8 main intent variants", () => {
      const mainIntents: IntentType[] = ["default", "price", "urgent", "safety", "lep", "ams", "stack", "single"];
      
      for (const intent of mainIntents) {
        expect(HERO_VARIANTS).toHaveProperty(intent);
        expect(HERO_VARIANTS[intent]).toHaveProperty("h1");
        expect(HERO_VARIANTS[intent]).toHaveProperty("subhead");
        expect(HERO_VARIANTS[intent]).toHaveProperty("bullets");
        expect(HERO_VARIANTS[intent]).toHaveProperty("ctaLabel");
      }
    });

    it("default variant mentions промышленные альпинисты", () => {
      expect(HERO_VARIANTS.default.h1.toLowerCase()).toContain("альпинист");
    });

    it("each variant has at least 3 bullets", () => {
      for (const [key, variant] of Object.entries(HERO_VARIANTS)) {
        expect(variant.bullets.length).toBeGreaterThanOrEqual(3);
      }
    });

    it("all main 8 variants have complete CTA fields", () => {
      const mainIntents: IntentType[] = ["default", "price", "urgent", "safety", "lep", "ams", "stack", "single"];
      
      for (const intent of mainIntents) {
        const variant = HERO_VARIANTS[intent];
        expect(variant.ctaLabel.length).toBeGreaterThan(0);
        expect(variant.ctaSecondaryLabel.length).toBeGreaterThan(0);
        expect(variant.subhead.length).toBeGreaterThan(10);
      }
    });

    it("lep variant mentions ЛЭП", () => {
      expect(HERO_VARIANTS.lep.h1.toLowerCase()).toContain("лэп");
    });

    it("ams variant mentions АМС or вышка", () => {
      const h1 = HERO_VARIANTS.ams.h1.toLowerCase();
      expect(h1.includes("амс") || h1.includes("вышк")).toBe(true);
    });

    it("stack variant mentions труб", () => {
      expect(HERO_VARIANTS.stack.h1.toLowerCase()).toContain("труб");
    });

    it("single variant mentions single contractor concept", () => {
      const h1 = HERO_VARIANTS.single.h1.toLowerCase();
      expect(h1.includes("один") || h1.includes("договор")).toBe(true);
    });
  });

  describe("CREDENTIALS", () => {
    it("has MChS license info", () => {
      expect(CREDENTIALS.mchs.number).toBe("63-06-2023-003418");
      expect(CREDENTIALS.mchs.date).toBe("23.08.2023");
    });

    it("has SRO construction info", () => {
      expect(CREDENTIALS.sroConstruction.memberNumber).toBe("1623");
      expect(CREDENTIALS.sroConstruction.date).toBe("20.11.2024");
    });

    it("has SRO design info", () => {
      expect(CREDENTIALS.sroDesign.memberNumber).toBe("455");
      expect(CREDENTIALS.sroDesign.date).toBe("06.12.2024");
    });
  });

  describe("exported constants", () => {
    it("SERVICE_NAMES has rope-access services", () => {
      expect(SERVICE_NAMES).toHaveProperty("rope-access");
      expect(SERVICE_NAMES).toHaveProperty("fireproofing-at-height");
      expect(SERVICE_NAMES).toHaveProperty("anticorrosion-at-height");
    });

    it("FAQ_DEFAULT has minimum 5 questions", () => {
      expect(FAQ_DEFAULT.length).toBeGreaterThanOrEqual(5);
    });

    it("BULLETS_DEFAULT has minimum 4 items", () => {
      expect(BULLETS_DEFAULT.length).toBeGreaterThanOrEqual(4);
    });

    it("TRUST_BLOCKS has default and verified variants", () => {
      expect(TRUST_BLOCKS).toHaveProperty("default");
      expect(TRUST_BLOCKS).toHaveProperty("verified");
      expect(TRUST_BLOCKS).toHaveProperty("credentials");
    });
  });

  describe("fallback behavior", () => {
    it("handles empty variables gracefully", () => {
      const result = resolveCopy({});
      
      expect(result.h1).not.toContain("{");
      expect(result.h1).not.toContain("}");
      expect(result.offer).not.toContain("{");
    });

    it("handles undefined query gracefully", () => {
      const result = resolveCopy({ query: undefined });
      
      expect(result.h1.length).toBeGreaterThan(0);
    });

    it("handles empty string query", () => {
      const result = resolveCopy({ query: "" });
      
      expect(result.h1.length).toBeGreaterThan(0);
    });

    it("never returns unresolved placeholders in any field", () => {
      const testCases = [
        {},
        { intent: "geo" as const, city: "Москва" },
        { intent: "price" as const },
        { intent: "lep" as const },
        { query: "услуги в Москве" },
        { query: "огнезащита резервуара" },
        { query: "антикоррозия" },
      ];
      
      for (const vars of testCases) {
        const result = resolveCopy(vars);
        
        const allText = [
          result.title,
          result.description,
          result.h1,
          result.subhead,
          result.offer,
          result.ctaLabel,
          result.ctaMicrocopy,
          result.trustBlock,
          result.answerBlock,
          ...result.bullets,
          ...result.faq.map(f => f.question + f.answer),
        ].join(" ");
        
        expect(allText).not.toMatch(/\{[a-zA-Z]+\}/);
      }
    });

    it("extracts city from query for geo intent", () => {
      const result = resolveCopy({ query: "услуги в Москва" });
      
      expect(result.h1).toContain("Москва");
    });

    it("extracts city for geo-only queries", () => {
      const cities = [
        { query: "услуги Екатеринбург", expected: "Екатеринбург" },
        { query: "бригады Казань", expected: "Казань" },
      ];
      
      for (const { query, expected } of cities) {
        const result = resolveCopy({ query });
        expect(result.h1).toContain(expected);
      }
    });

    it("service-specific queries get service intent over geo", () => {
      const result = resolveCopy({ query: "огнезащита в Москве" });
      
      expect(result.h1.toLowerCase()).toMatch(/огнезащит/);
    });
  });
});
