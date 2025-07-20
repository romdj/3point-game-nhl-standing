import type { Standing } from '../domain/standing';

export interface TeamComparison {
  current: Standing;
  historical: Standing | null;
  currentPosition: number;
  historicalPosition: number;
  positionChange: number;
  pointsChange: number;
  gamesChange: number;
}

export function createComparisonData(historical: Standing[], current: Standing[]): TeamComparison[] {
  // Sort both arrays by points (descending) to get positions
  const sortedHistorical = [...historical].sort((a, b) => b.points - a.points);
  const sortedCurrent = [...current].sort((a, b) => b.points - a.points);

  // Create lookup maps
  const historicalMap = new Map<string, { team: Standing; position: number }>();
  sortedHistorical.forEach((team, index) => {
    historicalMap.set(team.teamName, { team, position: index + 1 });
  });

  // Create comparison data for all current teams
  const comparisonData: TeamComparison[] = sortedCurrent.map((currentTeam, currentIndex) => {
    const currentPosition = currentIndex + 1;
    const historicalData = historicalMap.get(currentTeam.teamName);
    const historical = historicalData?.team || null;
    const historicalPosition = historicalData?.position || currentPosition;

    const positionChange = historicalPosition - currentPosition; // Positive = moved up
    const pointsChange = historical ? currentTeam.points - historical.points : currentTeam.points;
    const gamesChange = historical ? currentTeam.gamesPlayed - historical.gamesPlayed : currentTeam.gamesPlayed;

    return {
      current: currentTeam,
      historical,
      currentPosition,
      historicalPosition,
      positionChange,
      pointsChange,
      gamesChange
    };
  });

  return comparisonData;
}

export function getTeamPositionInStandings(standings: Standing[], teamName: string): number {
  const sortedStandings = [...standings].sort((a, b) => b.points - a.points);
  const position = sortedStandings.findIndex(team => team.teamName === teamName);
  return position === -1 ? -1 : position + 1;
}

export function calculatePositionChange(
  historicalStandings: Standing[], 
  currentStandings: Standing[], 
  teamName: string
): number {
  const historicalPosition = getTeamPositionInStandings(historicalStandings, teamName);
  const currentPosition = getTeamPositionInStandings(currentStandings, teamName);
  
  if (historicalPosition === -1 || currentPosition === -1) {
    return 0;
  }
  
  return historicalPosition - currentPosition; // Positive = moved up
}

export function getBiggestMovers(
  historical: Standing[], 
  current: Standing[], 
  limit: number = 5
): TeamComparison[] {
  const comparisonData = createComparisonData(historical, current);
  
  return comparisonData
    .filter(team => team.positionChange !== 0)
    .sort((a, b) => Math.abs(b.positionChange) - Math.abs(a.positionChange))
    .slice(0, limit);
}

export function getTeamTrend(comparison: TeamComparison): 'improving' | 'declining' | 'stable' {
  if (comparison.positionChange > 0) return 'improving';
  if (comparison.positionChange < 0) return 'declining';
  return 'stable';
}