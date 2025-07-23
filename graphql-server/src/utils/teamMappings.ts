/**
 * NHL Team ID mappings
 * Maps team abbreviations to their NHL API team IDs
 */

export const TEAM_ID_MAP: Record<string, number> = {
  // Atlantic Division
  'BOS': 6,   // Boston Bruins
  'BUF': 7,   // Buffalo Sabres
  'DET': 17,  // Detroit Red Wings
  'FLA': 13,  // Florida Panthers
  'MTL': 8,   // Montreal Canadiens
  'OTT': 9,   // Ottawa Senators
  'TBL': 14,  // Tampa Bay Lightning
  'TOR': 10,  // Toronto Maple Leafs

  // Metropolitan Division
  'CAR': 12,  // Carolina Hurricanes
  'CBJ': 29,  // Columbus Blue Jackets
  'NJD': 1,   // New Jersey Devils
  'NYI': 2,   // New York Islanders
  'NYR': 3,   // New York Rangers
  'PHI': 4,   // Philadelphia Flyers
  'PIT': 5,   // Pittsburgh Penguins
  'WSH': 15,  // Washington Capitals

  // Central Division
  'ARI': 53,  // Arizona Coyotes
  'CHI': 16,  // Chicago Blackhawks
  'COL': 21,  // Colorado Avalanche
  'DAL': 25,  // Dallas Stars
  'MIN': 30,  // Minnesota Wild
  'NSH': 18,  // Nashville Predators
  'STL': 19,  // St. Louis Blues
  'WPG': 52,  // Winnipeg Jets

  // Pacific Division
  'ANA': 24,  // Anaheim Ducks
  'CGY': 20,  // Calgary Flames
  'EDM': 22,  // Edmonton Oilers
  'LAK': 26,  // Los Angeles Kings
  'SJS': 28,  // San Jose Sharks
  'SEA': 55,  // Seattle Kraken
  'UTA': 53,  // Utah Hockey Club (formerly Arizona)
  'VAN': 23,  // Vancouver Canucks
  'VGK': 54,  // Vegas Golden Knights
} as const;

/**
 * Gets the NHL team ID for a given team abbreviation
 */
export function getTeamId(teamAbbrev: string): number | null {
  const teamId = TEAM_ID_MAP[teamAbbrev.toUpperCase()];
  return teamId || null;
}

/**
 * Gets the team abbreviation for a given NHL team ID
 */
export function getTeamAbbrev(teamId: number): string | null {
  const entry = Object.entries(TEAM_ID_MAP).find(([, id]) => id === teamId);
  return entry ? entry[0] : null;
}