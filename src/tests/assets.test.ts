import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { ALL_TAROT_CARDS } from "@/data/tarot/cards";
import { TAROT_CARD_ASSETS, getCardArtworkUrl } from "@/data/tarot/assets";

describe("Authentic Rider-Waite-Smith 78-Card Asset Collection", () => {
  it("should have exactly 78 card asset mappings", () => {
    const keys = Object.keys(TAROT_CARD_ASSETS);
    expect(keys.length).toBe(78);
  });

  it("should ensure every card in ALL_TAROT_CARDS has a valid asset mapping", () => {
    ALL_TAROT_CARDS.forEach((card) => {
      const assetUrl = getCardArtworkUrl(card.id);
      expect(assetUrl).toBeDefined();
      expect(assetUrl.startsWith("/tarot/cards/")).toBe(true);
      expect(TAROT_CARD_ASSETS[card.id]).toBe(assetUrl);
    });
  });

  it("should verify that all 78 card image files exist on disk and have valid sizes", () => {
    const publicDir = path.resolve(__dirname, "../../public");

    ALL_TAROT_CARDS.forEach((card) => {
      const relativePath = TAROT_CARD_ASSETS[card.id];
      const absolutePath = path.join(publicDir, relativePath);

      expect(fs.existsSync(absolutePath)).toBe(true);
      const stat = fs.statSync(absolutePath);
      // Valid high-resolution image must be at least 15KB
      expect(stat.size).toBeGreaterThan(15000);
    });
  });

  it("should verify public/tarot/manifest.json exists and is valid", () => {
    const manifestPath = path.resolve(__dirname, "../../public/tarot/manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(content.cardCount).toBe(78);
    expect(content.deck).toContain("Rider-Waite-Smith");
    expect(content.license).toContain("Public Domain");
  });
});

