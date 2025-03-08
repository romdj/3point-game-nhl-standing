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
    'Eastern Conference': [],
    'Western Conference': []
  };

  // First, group by division
  const byDivision = groupByDivision(standings);
  
  // Process each conference separately
  Object.entries(CONFERENCES).forEach(([conference, divisions]) => {
    const conferenceTeams: Standing[] = [];
    const divisionLeaders: Standing[] = [];
    
    // Get all teams in this conference and their division rankings
    divisions.forEach(division => {
      const divisionTeams = byDivision[division] || [];
      const [first, second, third, ...rest] = divisionTeams.sort(
        (a, b) => b.internationalSystemPoints - a.internationalSystemPoints
      );
      
      // Store top 3 from each division
      if (first) divisionLeaders.push(first);
      if (second) divisionLeaders.push(second);
      if (third) divisionLeaders.push(third);
      
      // Add remaining teams to conference pool for wild card consideration
      if (rest.length) conferenceTeams.push(...rest);
    });

    // Sort division leaders by points to determine division winners
    divisionLeaders.sort((a, b) => b.internationalSystemPoints - a.internationalSystemPoints);
    
    // Find the division winners (top team from each division)
    const divisionWinners = divisions.map(div => 
      divisionLeaders.find(team => team.divisionName === div)
    ).filter((team): team is Standing => team !== undefined);

    // Sort remaining division leaders (2nd and 3rd place teams)
    const otherDivisionLeaders = divisionLeaders.filter(
      team => !divisionWinners.includes(team)
    );

    // Sort conference teams for wild card spots
    conferenceTeams.sort((a, b) => b.internationalSystemPoints - a.internationalSystemPoints);
    const wildCardTeams = conferenceTeams.slice(0, 2); // Take top 2 for wild card

    // Organize the display groups
    const conferenceGroup = [
      // Division winners section
      { title: `${conference} - Division Winners`, teams: divisionWinners },
      // Other division leaders section (2nd & 3rd place teams)
      { title: `${conference} - Division Leaders`, teams: otherDivisionLeaders },
      // Wild card section
      { title: `${conference} - Wild Card`, teams: wildCardTeams }
    ];

    // Add each section to the grouped standings
    conferenceGroup.forEach(({ title, teams }) => {
      grouped[title] = teams;
    });
  });

  return grouped;
} 