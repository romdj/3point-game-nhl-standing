import type { Standing } from '../domain/standing';
import { CONFERENCES } from '../domain/standing';
import { WILDCARD_CONSTANTS } from '../constants/index.js';

export type Conference = keyof typeof CONFERENCES;
export type Division = (typeof CONFERENCES)[Conference][number];

interface GroupedStandings {
  [key: string]: Standing[];
}

type SortKey = keyof Standing;
type SortOrder = 'asc' | 'desc';

export function organizeStandings(
  standings: Standing[], 
  viewType: 'conference' | 'division' | 'wildcard' | 'league',
  sortKey: SortKey = 'internationalSystemPoints',
  sortOrder: SortOrder = 'desc'
): GroupedStandings {
  switch (viewType) {
    case 'conference':
      return groupByConference(standings, sortKey, sortOrder);
    case 'division':
      return groupByDivision(standings, sortKey, sortOrder);
    case 'wildcard':
      return organizeWildCard(standings, sortKey, sortOrder);
    case 'league':
    default:
      return { 'NHL': standings };
  }
}

function groupByConference(standings: Standing[], sortKey: SortKey, sortOrder: SortOrder): GroupedStandings {
  const grouped: GroupedStandings = {
    Eastern: [],
    Western: []
  };

  standings.forEach(team => {
    const conference = Object.entries(CONFERENCES).find(([_conf, divisions]) => 
      divisions.includes(team.divisionName)
    )?.[0];
    
    if (conference) {
      grouped[conference].push(team);
    }
  });

  // Sort each conference by the specified key and order
  Object.keys(grouped).forEach(conference => {
    grouped[conference].sort((a, b) => {
      const aVal = a[sortKey] as number | string;
      const bVal = b[sortKey] as number | string;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      } else {
        const aStr = String(aVal);
        const bStr = String(bVal);
        return sortOrder === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
      }
    });
  });

  return grouped;
}

function groupByDivision(standings: Standing[], sortKey: SortKey, sortOrder: SortOrder): GroupedStandings {
  const grouped: GroupedStandings = {};

  standings.forEach(team => {
    if (!grouped[team.divisionName]) {
      grouped[team.divisionName] = [];
    }
    grouped[team.divisionName].push(team);
  });

  // Sort each division by the specified key and order
  Object.keys(grouped).forEach(division => {
    grouped[division].sort((a, b) => {
      const aVal = a[sortKey] as number | string;
      const bVal = b[sortKey] as number | string;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      } else {
        const aStr = String(aVal);
        const bStr = String(bVal);
        return sortOrder === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
      }
    });
  });

  return grouped;
}

function organizeWildCard(standings: Standing[], sortKey: SortKey, sortOrder: SortOrder): GroupedStandings {
  const grouped: GroupedStandings = {};
  
  // First, group by division with sorting
  const byDivision = groupByDivision(standings, sortKey, sortOrder);
  
  // Process each conference separately
  Object.entries(CONFERENCES).forEach(([conference, divisions]) => {
    // Create sections for each division, wildcard, race, and rest
    divisions.forEach(division => {
      grouped[`${conference} - ${division}`] = [];
    });
    grouped[`${conference} - Wild Card`] = [];
    grouped[`${conference} - Race`] = [];
    grouped[`${conference} - Rest`] = [];
    
    // Get all teams in this conference by division
    const divisionTopTeams: Standing[] = [];
    const remainingTeams: Standing[] = [];
    
    // Extract top 3 from each division (already sorted by groupByDivision)
    divisions.forEach(division => {
      const divisionTeams = [...(byDivision[division] || [])];
      
      // Get top teams (already sorted)
      const topThree = divisionTeams.slice(0, WILDCARD_CONSTANTS.DIVISION_AUTOMATIC_QUALIFIERS);
      const rest = divisionTeams.slice(WILDCARD_CONSTANTS.DIVISION_AUTOMATIC_QUALIFIERS);
      
      // Add top 3 to their division group
      grouped[`${conference} - ${division}`] = topThree;
      
      // Store division top teams
      divisionTopTeams.push(...topThree);
      
      // Add remaining teams to conference pool for wild card consideration
      remainingTeams.push(...rest);
    });
    
    // Sort remaining conference teams by the specified key and order
    remainingTeams.sort((a, b) => {
      const aVal = a[sortKey] as number | string;
      const bVal = b[sortKey] as number | string;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      } else {
        const aStr = String(aVal);
        const bStr = String(bVal);
        return sortOrder === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
      }
    });
    
    // Take top 2 for wild card
    const wildCardTeams = remainingTeams.slice(0, WILDCARD_CONSTANTS.WILDCARD_SPOTS_PER_CONFERENCE);
    
    // Find the cutoff point for the playoff race (teams within threshold points of the last wildcard spot)
    const wildCardCutoff = wildCardTeams.length > 0 
      ? wildCardTeams[wildCardTeams.length - 1].internationalSystemPoints - WILDCARD_CONSTANTS.PLAYOFF_RACE_POINT_THRESHOLD
      : 0;
    
    // Separate teams in the race from the rest
    const raceTeams = [];
    const restOfConference = [];
    
    for (let i = 2; i < remainingTeams.length; i++) {
      const team = remainingTeams[i];
      if (team.internationalSystemPoints >= wildCardCutoff) {
        raceTeams.push(team);
      } else {
        restOfConference.push(team);
      }
    }
    
    // Assign to groups
    grouped[`${conference} - Wild Card`] = wildCardTeams;
    grouped[`${conference} - Race`] = raceTeams;
    grouped[`${conference} - Rest`] = restOfConference;
  });
  
  return grouped;
} 