import { describe, it, expect, vi } from "vitest";
import { calculateDaysLeft, formatWeddingDate } from "./useStore";

describe("useStore helper functions", () => {
  describe("calculateDaysLeft", () => {
    it("should return 0 for empty or null dates", () => {
      expect(calculateDaysLeft(null)).toBe(0);
      expect(calculateDaysLeft(undefined)).toBe(0);
      expect(calculateDaysLeft("")).toBe(0);
    });

    it("should return correct days for future dates", () => {
      // Mock "today" to be 2026-04-17
      const mockToday = new Date("2026-04-17T12:00:00Z");
      vi.setSystemTime(mockToday);

      const futureDate = "2026-04-27T12:00:00Z"; // 10 days later
      expect(calculateDaysLeft(futureDate)).toBe(10);
      
      vi.useRealTimers();
    });

    it("should return 0 for past dates", () => {
      const pastDate = "2020-01-01";
      expect(calculateDaysLeft(pastDate)).toBe(0);
    });

    it("should handle simple date strings", () => {
      const mockToday = new Date("2026-04-17T00:00:00Z");
      vi.setSystemTime(mockToday);

      expect(calculateDaysLeft("2026-04-20T00:00:00Z")).toBe(3);
      
      vi.useRealTimers();
    });
  });

  describe("formatWeddingDate", () => {
    it("should return 'Date TBD' for invalid input", () => {
      expect(formatWeddingDate(null)).toBe("Date TBD");
      expect(formatWeddingDate(undefined)).toBe("Date TBD");
      expect(formatWeddingDate("invalid-date")).toBe("Date TBD");
    });

    it("should format ISO strings correctly", () => {
      const date = "2026-12-15T10:00:00Z";
      // The exact output might depend on the locale, but we expect long month format
      expect(formatWeddingDate(date)).toMatch(/December 15, 2026/);
    });

    it("should handle short date strings", () => {
      expect(formatWeddingDate("2026-12-15")).toMatch(/December 15, 2026/);
    });
  });
});
