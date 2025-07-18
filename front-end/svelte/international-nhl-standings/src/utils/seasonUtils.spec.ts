import { describe, it, expect } from 'vitest';
import { 
  getCurrentNHLSeasonYear, 
  getDefaultStandingsDate, 
  getSeasonString, 
  isInSeason,
  hasSeasonData,
  getAvailableSeasons
} from './seasonUtils';

describe('seasonUtils', () => {
  describe('getCurrentNHLSeasonYear', () => {
    it('should return current year for September start of season', () => {
      const septemberDate = new Date('2024-09-01');
      expect(getCurrentNHLSeasonYear(septemberDate)).toBe(2024);
    });

    it('should return current year for December during season', () => {
      const decemberDate = new Date('2024-12-15');
      expect(getCurrentNHLSeasonYear(decemberDate)).toBe(2024);
    });

    it('should return previous year for January during season', () => {
      const januaryDate = new Date('2025-01-15');
      expect(getCurrentNHLSeasonYear(januaryDate)).toBe(2024);
    });

    it('should return previous year for April end of season', () => {
      const aprilDate = new Date('2025-04-15');
      expect(getCurrentNHLSeasonYear(aprilDate)).toBe(2024);
    });

    it('should return previous year for May off-season', () => {
      const mayDate = new Date('2025-05-15');
      expect(getCurrentNHLSeasonYear(mayDate)).toBe(2024);
    });

    it('should return previous year for August off-season', () => {
      const augustDate = new Date('2025-08-15');
      expect(getCurrentNHLSeasonYear(augustDate)).toBe(2024);
    });
  });

  describe('getDefaultStandingsDate', () => {
    it('should return today\'s date if within available season data range during season', () => {
      const validDate = new Date('2023-01-15'); // In season
      expect(getDefaultStandingsDate(validDate)).toBe('2023-01-15');
    });

    it('should return season start date for dates before season', () => {
      const earlyDate = new Date('2022-09-01'); // Before season start
      expect(getDefaultStandingsDate(earlyDate)).toBe('2022-10-01');
    });

    it('should return season end date for post-season (edge case)', () => {
      const postSeasonDate = new Date('2025-07-15'); // July 2025 - post-season
      expect(getDefaultStandingsDate(postSeasonDate)).toBe('2025-04-05'); // Should use 2024-2025 season end
    });

    it('should return season end date for May (post-season)', () => {
      const mayDate = new Date('2025-05-15'); // May 2025 - post-season
      expect(getDefaultStandingsDate(mayDate)).toBe('2025-04-05'); // Should use 2024-2025 season end
    });

    it('should return today\'s date during season for 2024-2025 season', () => {
      const inSeasonDate = new Date('2025-01-15'); // January 2025 - in 2024-2025 season
      expect(getDefaultStandingsDate(inSeasonDate)).toBe('2025-01-15');
    });

    it('should use specific season when provided', () => {
      const currentDate = new Date('2025-01-15');
      expect(getDefaultStandingsDate(currentDate, 2022)).toBe('2023-04-05'); // Use 2022 season end date
    });

    it('should handle post-season for specific season', () => {
      const postSeasonDate = new Date('2025-07-15');
      expect(getDefaultStandingsDate(postSeasonDate, 2024)).toBe('2025-04-05'); // Post-season, use end date
    });

    it('should fallback to most recent available season for unavailable seasons', () => {
      const futureDate = new Date('2027-01-15'); // Far future with no season data
      expect(getDefaultStandingsDate(futureDate)).toBe('2025-04-05'); // Most recent available
    });

    it('should handle current edge case: July 2025 should show 2024-2025 final standings', () => {
      const currentEdgeCase = new Date('2025-07-18'); // Today's date
      expect(getDefaultStandingsDate(currentEdgeCase)).toBe('2025-04-05'); // 2024-2025 season end
    });
  });

  describe('getSeasonString', () => {
    it('should format season string correctly', () => {
      expect(getSeasonString(2022)).toBe('2022-2023');
      expect(getSeasonString(2024)).toBe('2024-2025');
    });
  });

  describe('isInSeason', () => {
    it('should return true for September (start of season)', () => {
      const septemberDate = new Date('2024-09-01');
      expect(isInSeason(septemberDate)).toBe(true);
    });

    it('should return true for December (during season)', () => {
      const decemberDate = new Date('2024-12-15');
      expect(isInSeason(decemberDate)).toBe(true);
    });

    it('should return true for January (during season)', () => {
      const januaryDate = new Date('2025-01-15');
      expect(isInSeason(januaryDate)).toBe(true);
    });

    it('should return true for April (end of season)', () => {
      const aprilDate = new Date('2025-04-15');
      expect(isInSeason(aprilDate)).toBe(true);
    });

    it('should return false for May (off-season)', () => {
      const mayDate = new Date('2025-05-15');
      expect(isInSeason(mayDate)).toBe(false);
    });

    it('should return false for August (off-season)', () => {
      const augustDate = new Date('2025-08-15');
      expect(isInSeason(augustDate)).toBe(false);
    });
  });

  describe('hasSeasonData', () => {
    it('should return true for seasons with data', () => {
      expect(hasSeasonData(2022)).toBe(true);
      expect(hasSeasonData(2024)).toBe(true);
    });

    it('should return false for seasons without data', () => {
      expect(hasSeasonData(2023)).toBe(false);
    });
  });

  describe('getAvailableSeasons', () => {
    it('should return array of available seasons sorted by most recent first', () => {
      expect(getAvailableSeasons()).toEqual([2024, 2022]);
    });
  });
});