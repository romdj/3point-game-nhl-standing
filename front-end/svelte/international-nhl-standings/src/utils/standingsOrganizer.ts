import type { Standing } from '../domain/standing';
import { CONFERENCES } from '../domain/standing';

export type Conference = keyof typeof CONFERENCES;
export type Division = (typeof CONFERENCES)[Conference][number];

interface GroupedStandings {
  [key: string]: Standing[];
}

export function organizeStandings(standings: Standing[], viewType: 'conference' | 'division' | 'wildcard' | 'league'): GroupedStandings {
  switch (viewType) {
    case 'conference':
      return groupByConference(standings);
    case 'division':
      return groupByDivision(standings);
    case 'wildcard':
      return organizeWildCard(standings);
    case 'league':
    default:
      return { 'NHL': standings };
  }
}

function groupByConference(standings: Standing[]): GroupedStandings {
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

  // Sort each conference by points
  Object.keys(grouped).forEach(conference => {
    grouped[conference].sort((a, b) => b.internationalSystemPoints - a.internationalSystemPoints);
  });

  return grouped;
}

function groupByDivision(standings: Standing[]): GroupedStandings {
  const grouped: GroupedStandings = {};

  standings.forEach(team => {
    if (!grouped[team.divisionName]) {
      grouped[team.divisionName] = [];
    }
    grouped[team.divisionName].push(team);
  });

  // Sort each division by points
  Object.keys(grouped).forEach(division => {
    grouped[division].sort((a, b) => b.internationalSystemPoints - a.internationalSystemPoints);
  });

  return grouped;
}

function organizeWildCard(standings: Standing[]): GroupedStandings {
  const grouped: GroupedStandings = {};
  
  // First, group by division
  const byDivision = groupByDivision(standings);
  
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
    
    // Extract top 3 from each division
    divisions.forEach(division => {
      const divisionTeams = [...(byDivision[division] || [])];
      divisionTeams.sort((a, b) => b.internationalSystemPoints - a.internationalSystemPoints);
      
      // Get top 3 teams
      const topThree = divisionTeams.slice(0, 3);
      const rest = divisionTeams.slice(3);
      
      // Add top 3 to their division group
      grouped[`${conference} - ${division}`] = topThree;
      
      // Store division top teams
      divisionTopTeams.push(...topThree);
      
      // Add remaining teams to conference pool for wild card consideration
      remainingTeams.push(...rest);
    });
    
    // Sort remaining conference teams by points
    remainingTeams.sort((a, b) => b.internationalSystemPoints - a.internationalSystemPoints);
    
    // Take top 2 for wild card
    const wildCardTeams = remainingTeams.slice(0, 2);
    
    // Find the cutoff point for the playoff race (teams within 7 points of the last wildcard spot)
    const wildCardCutoff = wildCardTeams.length > 0 
      ? wildCardTeams[wildCardTeams.length - 1].internationalSystemPoints - 7 
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