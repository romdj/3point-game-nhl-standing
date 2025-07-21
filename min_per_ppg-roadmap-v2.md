# 🏒⚡ Minutes Per Powerplay Goal v2 - Powerplay Type Differentiation

## 📋 Overview

This v2 roadmap extends the initial Minutes Per Powerplay Goal implementation to differentiate between different powerplay situations: **5v4**, **4v3**, and **5v3** powerplays. Each situation has distinct dynamics and efficiency characteristics that warrant separate tracking and analysis.

## 🎯 Powerplay Types Explained

### 5v4 Powerplay (Most Common)
- **Situation**: One opponent in penalty box
- **Players**: 5 attackers vs 4 defenders + goalie
- **Duration**: Typically full 2-minute minor penalties
- **Strategy**: Setup plays, cycle possession, screen shots

### 4v3 Powerplay (Rare)
- **Situation**: One opponent in penalty box while your team is also short-handed
- **Players**: 4 attackers vs 3 defenders + goalie
- **Duration**: Varies based on penalty timing
- **Strategy**: Quick plays, man advantage less pronounced

### 5v3 Powerplay (Two-Man Advantage)
- **Situation**: Two opponents in penalty box simultaneously
- **Players**: 5 attackers vs 3 defenders + goalie
- **Duration**: Usually shorter (until first penalty expires)
- **Strategy**: High-percentage plays, should be most efficient

## 📊 Enhanced Metric Definitions

### Individual Powerplay Type Metrics
```
5v4 Min/PPG = Total 5v4 Powerplay Minutes / Total 5v4 Powerplay Goals
4v3 Min/PPG = Total 4v3 Powerplay Minutes / Total 4v3 Powerplay Goals  
5v3 Min/PPG = Total 5v3 Powerplay Minutes / Total 5v3 Powerplay Goals
```

### Composite Efficiency Score
```
Weighted PP Efficiency = (5v4_goals * 1.0 + 4v3_goals * 1.2 + 5v3_goals * 0.6) / Total_PP_Minutes
```
*Weights reflect expected difficulty/opportunity of each situation*

## 🗺️ V2 Implementation Strategy

### Phase 1: Enhanced Data Collection

#### 1.1 NHL API Endpoint Research
The NHL API provides situation-specific statistics through:
- **Situational Stats Endpoint**: `/stats/rest/en/team/powerplay/situation`
- **Game Events Endpoint**: `/v1/gamecenter/{GAME-ID}/play-by-play` (for detailed situational analysis)

#### 1.2 Extended GraphQL Schema
```graphql
type PowerplayStats {
  # V1 fields (overall)
  powerplayGoals: Int!
  powerplayMinutes: Float!
  minutesPerPowerplayGoal: Float
  powerplayPercentage: Float!
  
  # V2 additions (situational)
  situationalStats: PowerplaySituationalStats!
}

type PowerplaySituationalStats {
  fiveVsFour: PowerplaySituation!
  fourVsThree: PowerplaySituation!
  fiveVsThree: PowerplaySituation!
}

type PowerplaySituation {
  goals: Int!
  minutes: Float!
  opportunities: Int!
  minutesPerGoal: Float
  percentage: Float!
  efficiency: PowerplayEfficiencyRating!
}

enum PowerplayEfficiencyRating {
  EXCELLENT    # < 5 min/goal for 5v3, < 8 min/goal for 5v4, < 12 min/goal for 4v3
  GOOD         # Good range for each situation type
  AVERAGE      # League average range
  POOR         # Above average time per goal
  VERY_POOR    # Significantly inefficient
}
```

### Phase 2: Backend Enhancement

#### 2.1 Situational Data Service
**File**: `graphql-server/src/services/powerplayAnalysisService.ts`

```typescript
interface SituationalPowerplayData {
  fiveVsFour: {
    goals: number;
    minutes: number;
    opportunities: number;
  };
  fourVsThree: {
    goals: number;
    minutes: number;
    opportunities: number;
  };
  fiveVsThree: {
    goals: number;
    minutes: number;
    opportunities: number;
  };
}

export class PowerplayAnalysisService {
  
  async getSituationalPowerplayStats(teamId: string, season: string): Promise<SituationalPowerplayData> {
    // Fetch from NHL API situational endpoints
    const [fiveVsFourData, fourVsThreeData, fiveVsThreeData] = await Promise.all([
      this.fetchSituationStats(teamId, season, '5v4'),
      this.fetchSituationStats(teamId, season, '4v3'),
      this.fetchSituationStats(teamId, season, '5v3')
    ]);
    
    return {
      fiveVsFour: fiveVsFourData,
      fourVsThree: fourVsThreeData,
      fiveVsThree: fiveVsThreeData
    };
  }
  
  private async fetchSituationStats(teamId: string, season: string, situation: string) {
    const url = `https://api.nhle.com/stats/rest/en/team/powerplay/situation?cayenneExp=seasonId=${season}&teamId=${teamId}&situation=${situation}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        goals: data.powerPlayGoals || 0,
        minutes: (data.powerPlayTimeOnIce || 0) / 60, // Convert seconds to minutes
        opportunities: data.powerPlayOpportunities || 0
      };
    } catch (error) {
      this.logger.warn(`Failed to fetch ${situation} powerplay stats for team ${teamId}`, { error });
      return { goals: 0, minutes: 0, opportunities: 0 };
    }
  }
  
  calculateSituationalEfficiency(goals: number, minutes: number): PowerplayEfficiencyRating {
    if (goals === 0) return PowerplayEfficiencyRating.VERY_POOR;
    
    const minPerGoal = minutes / goals;
    
    // Different thresholds for different situations
    // These would be refined based on league averages
    if (minPerGoal < 6) return PowerplayEfficiencyRating.EXCELLENT;
    if (minPerGoal < 9) return PowerplayEfficiencyRating.GOOD;
    if (minPerGoal < 12) return PowerplayEfficiencyRating.AVERAGE;
    if (minPerGoal < 15) return PowerplayEfficiencyRating.POOR;
    return PowerplayEfficiencyRating.VERY_POOR;
  }
}
```

#### 2.2 Enhanced GraphQL Resolvers
```typescript
const resolveEnhancedPowerplayStats = async (teamId: string, season: string): Promise<PowerplayStats> => {
  const [overallStats, situationalStats] = await Promise.all([
    powerplayService.getOverallPowerplayStats(teamId, season),
    powerplayAnalysisService.getSituationalPowerplayStats(teamId, season)
  ]);
  
  return {
    // V1 overall stats
    powerplayGoals: overallStats.powerplayGoals,
    powerplayMinutes: overallStats.powerplayMinutes,
    minutesPerPowerplayGoal: calculateMinPerPPG(overallStats.powerplayGoals, overallStats.powerplayMinutes),
    powerplayPercentage: overallStats.powerplayPercentage,
    
    // V2 situational stats
    situationalStats: {
      fiveVsFour: {
        goals: situationalStats.fiveVsFour.goals,
        minutes: situationalStats.fiveVsFour.minutes,
        opportunities: situationalStats.fiveVsFour.opportunities,
        minutesPerGoal: calculateMinPerPPG(situationalStats.fiveVsFour.goals, situationalStats.fiveVsFour.minutes),
        percentage: calculatePercentage(situationalStats.fiveVsFour.goals, situationalStats.fiveVsFour.opportunities),
        efficiency: powerplayAnalysisService.calculateSituationalEfficiency(
          situationalStats.fiveVsFour.goals, 
          situationalStats.fiveVsFour.minutes
        )
      },
      fourVsThree: {
        // Similar structure for 4v3
      },
      fiveVsThree: {
        // Similar structure for 5v3
      }
    }
  };
};
```

### Phase 3: Enhanced Frontend Implementation

#### 3.1 Extended Domain Models
**File**: `frontend/src/domain/powerplay.ts`

```typescript
export interface SituationalPowerplayStats {
  goals: number;
  minutes: number;
  opportunities: number;
  minutesPerGoal: number | null;
  percentage: number;
  efficiency: PowerplayEfficiencyRating;
}

export interface PowerplaySituationalStats {
  fiveVsFour: SituationalPowerplayStats;
  fourVsThree: SituationalPowerplayStats;
  fiveVsThree: SituationalPowerplayStats;
}

export enum PowerplayEfficiencyRating {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD', 
  AVERAGE = 'AVERAGE',
  POOR = 'POOR',
  VERY_POOR = 'VERY_POOR'
}
```

#### 3.2 Enhanced Table Columns
**File**: `frontend/src/components/Table/PowerplayColumns.ts`

```typescript
export const POWERPLAY_V2_COLUMNS: TableColumn[] = [
  {
    key: 'minutesPerPowerplayGoal',
    label: 'Overall Min/PPG',
    sortable: true,
    tooltip: 'Minutes per powerplay goal (all situations)'
  },
  {
    key: 'fiveVsFourMinPerGoal',
    label: '5v4 Min/PPG', 
    sortable: true,
    tooltip: 'Minutes per goal on 5-on-4 powerplay'
  },
  {
    key: 'fourVsThreeMinPerGoal',
    label: '4v3 Min/PPG',
    sortable: true, 
    tooltip: 'Minutes per goal on 4-on-3 powerplay'
  },
  {
    key: 'fiveVsThreeMinPerGoal',
    label: '5v3 Min/PPG',
    sortable: true,
    tooltip: 'Minutes per goal on 5-on-3 powerplay (2-man advantage)'
  },
  {
    key: 'powerplayPercentage',
    label: 'Overall PP%',
    sortable: true,
    tooltip: 'Traditional powerplay percentage'
  }
];
```

#### 3.3 Situational Powerplay Display Component
**File**: `frontend/src/components/Powerplay/SituationalPowerplayDisplay.svelte`

```svelte
<script lang="ts">
  import type { PowerplaySituationalStats } from '$lib/domain/powerplay';
  
  export let situationalStats: PowerplaySituationalStats;
  
  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'EXCELLENT': return 'text-green-600 bg-green-50';
      case 'GOOD': return 'text-green-500 bg-green-25';
      case 'AVERAGE': return 'text-yellow-600 bg-yellow-50';
      case 'POOR': return 'text-orange-600 bg-orange-50';
      case 'VERY_POOR': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
</script>

<div class="situational-powerplay-stats">
  <h4 class="text-sm font-semibold text-gray-700 mb-2">Powerplay Efficiency by Situation</h4>
  
  <div class="grid grid-cols-3 gap-2 text-xs">
    <!-- 5v4 Stats -->
    <div class="powerplay-situation">
      <div class="font-medium text-gray-600">5v4</div>
      <div class="metric">
        <span class="label">Goals:</span>
        <span class="value">{situationalStats.fiveVsFour.goals}</span>
      </div>
      <div class="metric">
        <span class="label">Min/Goal:</span>
        <span class="value {getEfficiencyColor(situationalStats.fiveVsFour.efficiency)}">
          {situationalStats.fiveVsFour.minutesPerGoal?.toFixed(1) ?? 'N/A'}
        </span>
      </div>
      <div class="metric">
        <span class="label">%:</span>
        <span class="value">{situationalStats.fiveVsFour.percentage.toFixed(1)}%</span>
      </div>
    </div>
    
    <!-- 4v3 Stats -->
    <div class="powerplay-situation">
      <div class="font-medium text-gray-600">4v3</div>
      <div class="metric">
        <span class="label">Goals:</span>
        <span class="value">{situationalStats.fourVsThree.goals}</span>
      </div>
      <div class="metric">
        <span class="label">Min/Goal:</span>
        <span class="value {getEfficiencyColor(situationalStats.fourVsThree.efficiency)}">
          {situationalStats.fourVsThree.minutesPerGoal?.toFixed(1) ?? 'N/A'}
        </span>
      </div>
      <div class="metric">
        <span class="label">%:</span>
        <span class="value">{situationalStats.fourVsThree.percentage.toFixed(1)}%</span>
      </div>
    </div>
    
    <!-- 5v3 Stats -->
    <div class="powerplay-situation">
      <div class="font-medium text-gray-600">5v3</div>
      <div class="metric">
        <span class="label">Goals:</span>
        <span class="value">{situationalStats.fiveVsThree.goals}</span>
      </div>
      <div class="metric">
        <span class="label">Min/Goal:</span>
        <span class="value {getEfficiencyColor(situationalStats.fiveVsThree.efficiency)}">
          {situationalStats.fiveVsThree.minutesPerGoal?.toFixed(1) ?? 'N/A'}
        </span>
      </div>
      <div class="metric">
        <span class="label">%:</span>
        <span class="value">{situationalStats.fiveVsThree.percentage.toFixed(1)}%</span>
      </div>
    </div>
  </div>
</div>

<style>
  .powerplay-situation {
    @apply border border-gray-200 rounded p-2;
  }
  
  .metric {
    @apply flex justify-between items-center;
  }
  
  .label {
    @apply text-gray-500;
  }
  
  .value {
    @apply font-medium;
  }
</style>
```

### Phase 4: Advanced Analytics & Visualizations

#### 4.1 Powerplay Efficiency Comparison Chart
**File**: `frontend/src/components/Powerplay/EfficiencyComparisonChart.svelte`

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import type { Standing } from '$lib/domain/standing';
  
  export let standings: Standing[];
  
  let chartContainer: HTMLElement;
  
  const prepareChartData = () => {
    return standings.map(team => ({
      team: team.teamAbbrev,
      '5v4': team.powerplayStats?.situationalStats.fiveVsFour.minutesPerGoal || null,
      '4v3': team.powerplayStats?.situationalStats.fourVsThree.minutesPerGoal || null,
      '5v3': team.powerplayStats?.situationalStats.fiveVsThree.minutesPerGoal || null
    }));
  };
  
  onMount(() => {
    // Initialize chart with D3 or Chart.js
    // Show scatter plot or grouped bar chart of efficiency by situation
  });
</script>

<div class="powerplay-efficiency-chart">
  <h3 class="text-lg font-semibold mb-4">Powerplay Efficiency by Situation</h3>
  <div bind:this={chartContainer} class="chart-container h-80"></div>
  
  <div class="legend mt-4">
    <div class="legend-item">
      <span class="legend-color bg-blue-500"></span>
      <span>5v4 (Standard PP)</span>
    </div>
    <div class="legend-item">
      <span class="legend-color bg-orange-500"></span>
      <span>4v3 (Short PP)</span>
    </div>
    <div class="legend-item">
      <span class="legend-color bg-green-500"></span>
      <span>5v3 (Two-man advantage)</span>
    </div>
  </div>
</div>
```

#### 4.2 Situational Insights Component
```svelte
<!-- PowerplayInsights.svelte -->
<div class="powerplay-insights">
  <h3 class="text-lg font-semibold mb-4">Powerplay Insights</h3>
  
  <div class="insights-grid">
    <div class="insight-card">
      <h4>Most Efficient 5v4</h4>
      <div class="team-stat">
        <span class="team">{mostEfficient5v4.team}</span>
        <span class="stat">{mostEfficient5v4.minPerGoal}min/goal</span>
      </div>
    </div>
    
    <div class="insight-card">
      <h4>Best 5v3 Conversion</h4>
      <div class="team-stat">
        <span class="team">{bestFiveVsThree.team}</span>
        <span class="stat">{bestFiveVsThree.minPerGoal}min/goal</span>
      </div>
    </div>
    
    <div class="insight-card">
      <h4>Most Balanced PP</h4>
      <div class="team-stat">
        <span class="team">{mostBalanced.team}</span>
        <span class="stat">Consistent across situations</span>
      </div>
    </div>
  </div>
</div>
```

## 🎯 Key Implementation Considerations

### Data Accuracy Challenges
1. **Situation Detection**: Accurately identifying 4v3 vs 5v4 vs 5v3 from API data
2. **Time Tracking**: Precise minute calculations for each situation type
3. **Edge Cases**: Delayed penalties, coincidental minors, etc.

### Performance Optimization
1. **Selective Loading**: Load situational data on-demand (expandable rows)
2. **Caching Strategy**: Different cache TTLs for different data types
3. **API Batching**: Combine multiple situational requests

### UI/UX Design
1. **Progressive Disclosure**: Start with overall stats, expand to see situational
2. **Comparative Views**: Side-by-side situation comparisons
3. **Mobile Responsiveness**: Collapsible situational data on small screens

## 📊 Expected Insights from V2

### Team Strategy Analysis
- **Specialized Teams**: Some teams may excel at 5v3 but struggle with 5v4
- **System Efficiency**: Teams with consistent efficiency across all situations
- **Opportunity Conversion**: Which teams make the most of rare 5v3 chances

### League-Wide Patterns
- **Situation Frequency**: How often each powerplay type occurs
- **Average Efficiency**: League benchmarks for each situation
- **Correlation Analysis**: Relationship between situational PP efficiency and overall team success

## 🚀 Implementation Priority

### V2.1: Core Situational Tracking
- [ ] Implement 5v4, 4v3, 5v3 data collection
- [ ] Basic situational display in expanded view
- [ ] Sorting by situational efficiency

### V2.2: Advanced Analytics
- [ ] Efficiency comparison charts
- [ ] League ranking by situation type
- [ ] Historical situational trends

### V2.3: Insights & Intelligence
- [ ] Automated insights generation
- [ ] Situation-specific team recommendations
- [ ] Predictive efficiency modeling

---

*This v2 roadmap transforms the basic minutes per powerplay goal feature into a comprehensive powerplay analytics platform, providing deep insights into team efficiency across all powerplay situations.*