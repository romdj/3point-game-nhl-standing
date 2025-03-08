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
    const conference = Object.entries(CONFERENCES).find(([_, divisions]) => 
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
  const grouped: GroupedStandings = {
    'Eastern - Division Leaders': [],
    'Eastern - Wild Card': [],
    'Western - Division Leaders': [],
    'Western - Wild Card': []
  };

  // First, group by division and get top 3 from each
  const byDivision = groupByDivision(standings);
  
  Object.entries(CONFERENCES).forEach(([conference, divisions]) => {
    divisions.forEach(division => {
      const divisionTeams = byDivision[division] || [];
      const [first, second, third, ...rest] = divisionTeams;
      
      if (first) grouped[`${conference} - Division Leaders`].push(first);
      if (second) grouped[`${conference} - Division Leaders`].push(second);
      if (third) grouped[`${conference} - Division Leaders`].push(third);
      
      if (rest.length) {
        grouped[`${conference} - Wild Card`].push(...rest);
      }
    });

    // Sort division leaders by points
    grouped[`${conference} - Division Leaders`].sort((a, b) => 
      b.internationalSystemPoints - a.internationalSystemPoints
    );

    // Sort wild card teams by points
    grouped[`${conference} - Wild Card`].sort((a, b) => 
      b.internationalSystemPoints - a.internationalSystemPoints
    );
  });

  return grouped;
} 