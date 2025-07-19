/**
 * Utility functions for NHL season date handling
 * NHL season runs from September to April (next year)
 * Each season has different data availability windows
 */

import seasonsConfig from '../config/seasons.json';

// Import season data from configuration
const SEASON_DATA_RANGES: Record<number, { start: string; end: string }> = 
  Object.fromEntries(
    Object.entries(seasonsConfig.seasons).map(([key, value]) => [
      parseInt(key), 
      { start: value.start, end: value.end }
    ])
  );

/**
 * Determines the appropriate NHL season year based on the current date
 * @param currentDate - The current date (defaults to today)
 * @returns The season year (e.g., 2024 for 2024-2025 season)
 */
export function getCurrentNHLSeasonYear(currentDate: Date = new Date()): number {
  const month = currentDate.getMonth(); // 0-based (0 = January, 8 = September)
  const year = currentDate.getFullYear();
  
  // If we're in September (8) through December (11), it's the start of the season
  if (month >= 8) {
    return year;
  }
  // If we're in January (0) through April (3), it's the end of the season
  else if (month <= 3) {
    return year - 1;
  }
  // May through August - off-season, use previous season
  else {
    return year - 1;
  }
}

/**
 * Gets the default date to use for NHL standings API calls
 * Falls back to available data if current season data isn't available
 * @param currentDate - The current date (defaults to today)
 * @param seasonYear - Optional specific season year to get data for
 * @returns ISO date string in format YYYY-MM-DD
 */
export function getDefaultStandingsDate(currentDate: Date = new Date(), seasonYear?: number): string {
  const currentDateStr = currentDate.toISOString().split('T')[0];
  const targetSeason = seasonYear || getCurrentNHLSeasonYear(currentDate);
  
  // Check if we have data for the target season
  const seasonData = SEASON_DATA_RANGES[targetSeason];
  
  if (seasonData) {
    // If we're in season (September through April), use appropriate date
    if (isInSeason(currentDate)) {
      // If current date is within the season data range, use it
      if (currentDateStr >= seasonData.start && currentDateStr <= seasonData.end) {
        return currentDateStr;
      }
      // If before season start, use start date
      if (currentDateStr < seasonData.start) {
        return seasonData.start;
      }
    }
    
    // If we're in post-season (May through August), use the end date of the season
    // This handles the edge case where we're in July 2025 and want 2024-2025 season final standings
    return seasonData.end;
  }
  
  // Fallback to most recent available season data
  const availableSeasons = Object.keys(SEASON_DATA_RANGES).map(Number).sort((a, b) => b - a);
  const mostRecentSeason = availableSeasons[0];
  const fallbackData = SEASON_DATA_RANGES[mostRecentSeason];
  
  return fallbackData.end; // Use end date of most recent available season
}

/**
 * Gets the season string for display purposes
 * @param seasonYear - The season year (e.g., 2024 for 2024-2025 season)
 * @returns Season string in format "2024-2025"
 */
export function getSeasonString(seasonYear: number): string {
  return `${seasonYear}-${seasonYear + 1}`;
}

/**
 * Checks if we're currently in the NHL season
 * @param currentDate - The current date (defaults to today)
 * @param seasonYear - Optional specific season year to check
 * @returns True if we're in the theoretical season period, false if off-season
 */
export function isInSeason(currentDate: Date = new Date(), _seasonYear?: number): boolean {
  const month = currentDate.getMonth();
  // NHL season runs September through April
  return month >= 8 || month <= 3;
}

/**
 * Checks if we have data available for a specific season
 * @param seasonYear - The season year to check
 * @returns True if we have data for this season
 */
export function hasSeasonData(seasonYear: number): boolean {
  return seasonYear in SEASON_DATA_RANGES;
}

/**
 * Gets all available seasons
 * @returns Array of season years we have data for
 */
export function getAvailableSeasons(): number[] {
  return Object.keys(SEASON_DATA_RANGES).map(Number).sort((a, b) => b - a);
}