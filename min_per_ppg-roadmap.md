# 🏒⚡ Minutes Per Powerplay Goal (min_per_ppg) Implementation Roadmap

## 📋 Overview

This roadmap outlines the implementation of a new advanced statistic: **Minutes Per Powerplay Goal (min_per_ppg)**. This metric provides a more accurate representation of powerplay efficiency by considering the actual time spent on the powerplay rather than just the number of opportunities.

## 🎯 Objective

Create a system that calculates and displays how many minutes of powerplay time it takes for each team to score a powerplay goal, providing a more nuanced view of special teams effectiveness than traditional powerplay percentage.

## 📊 Metric Definition

**Minutes Per Powerplay Goal (min_per_ppg)** = Total Powerplay Minutes / Total Powerplay Goals

### Example Calculation:
- Team A: 120 powerplay minutes, 15 powerplay goals → 8.0 min_per_ppg
- Team B: 100 powerplay minutes, 10 powerplay goals → 10.0 min_per_ppg
- **Team A is more efficient** (scores faster on powerplay)

## 🗺️ Implementation Strategy

### Phase 1: Data Source Integration (No Storage)
Following the requirement for **no storage** and leveraging our **GraphQL connector**, we'll integrate directly with NHL APIs.

#### 1.1 NHL API Endpoints Research
Based on our NHL API documentation, we need:
- **Team Statistics Endpoint**: `/v1/club-stats/{TEAM}/{SEASON}/{GAME-TYPE}`
- **Powerplay Data**: Available in team summary statistics
- **Time-based Metrics**: Powerplay minutes, powerplay goals

#### 1.2 GraphQL Schema Extension
Extend existing GraphQL schema to include powerplay metrics:

```graphql
type Team {
  # Existing fields...
  powerplayStats: PowerplayStats
}

type PowerplayStats {
  powerplayGoals: Int!
  powerplayMinutes: Float!
  minutesPerPowerplayGoal: Float
  powerplayOpportunities: Int!
  powerplayPercentage: Float!
}
```

### Phase 2: Backend Implementation

#### 2.1 GraphQL Resolver Enhancement
**File**: `graphql-server/src/resolvers/teamResolvers.ts`

```typescript
interface PowerplayData {
  powerplayGoals: number;
  powerplayMinutes: number;
  powerplayOpportunities: number;
}

const resolvePowerplayStats = async (teamId: string, season: string): Promise<PowerplayStats> => {
  const data = await nhlApiService.getTeamPowerplayStats(teamId, season);
  
  return {
    powerplayGoals: data.powerplayGoals,
    powerplayMinutes: data.powerplayMinutes,
    minutesPerPowerplayGoal: calculateMinPerPPG(data.powerplayGoals, data.powerplayMinutes),
    powerplayOpportunities: data.powerplayOpportunities,
    powerplayPercentage: (data.powerplayGoals / data.powerplayOpportunities) * 100
  };
};

const calculateMinPerPPG = (goals: number, minutes: number): number | null => {
  return goals > 0 ? minutes / goals : null;
};
```

#### 2.2 NHL API Service Extension
**File**: `graphql-server/src/services/nhlApiService.ts`

```typescript
export class NHLApiService {
  async getTeamPowerplayStats(teamId: string, season: string): Promise<PowerplayData> {
    const url = `https://api.nhle.com/stats/rest/en/team/powerplay?cayenneExp=seasonId=${season}&teamId=${teamId}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        powerplayGoals: data.powerPlayGoals,
        powerplayMinutes: data.powerPlayTimeOnIce, // Convert seconds to minutes
        powerplayOpportunities: data.powerPlayOpportunities
      };
    } catch (error) {
      throw new Error(`Failed to fetch powerplay stats: ${error.message}`);
    }
  }
}
```

### Phase 3: Frontend Integration

#### 3.1 GraphQL Query Extension
**File**: `frontend/src/api/standingsAPI.ts`

```typescript
const STANDINGS_WITH_POWERPLAY_QUERY = `
  query GetStandingsWithPowerplay($season: String!) {
    standings(season: $season) {
      # Existing fields...
      powerplayStats {
        powerplayGoals
        powerplayMinutes
        minutesPerPowerplayGoal
        powerplayOpportunities
        powerplayPercentage
      }
    }
  }
`;
```

#### 3.2 Domain Model Extension
**File**: `frontend/src/domain/standing.ts`

```typescript
export interface PowerplayStats {
  powerplayGoals: number;
  powerplayMinutes: number;
  minutesPerPowerplayGoal: number | null;
  powerplayOpportunities: number;
  powerplayPercentage: number;
}

export interface Standing {
  // Existing fields...
  powerplayStats?: PowerplayStats;
}
```

#### 3.3 UI Component Enhancement
**File**: `frontend/src/components/Table/TableColumns.ts`

```typescript
export const POWERPLAY_COLUMNS: TableColumn[] = [
  {
    key: 'minutesPerPowerplayGoal',
    label: 'Min/PPG',
    sortable: true,
    tooltip: 'Minutes per powerplay goal - lower is better'
  },
  {
    key: 'powerplayPercentage', 
    label: 'PP%',
    sortable: true,
    tooltip: 'Traditional powerplay percentage'
  }
];
```

#### 3.4 Standings Display Component
**File**: `frontend/src/components/Table/TableRow.svelte`

```svelte
{#if column.key === 'minutesPerPowerplayGoal'}
  <span class="text-sm" class:text-green-600={standing.powerplayStats?.minutesPerPowerplayGoal < 8}
                      class:text-red-600={standing.powerplayStats?.minutesPerPowerplayGoal > 12}>
    {standing.powerplayStats?.minutesPerPowerplayGoal?.toFixed(1) ?? 'N/A'}
  </span>
{/if}
```

### Phase 4: Advanced Features

#### 4.1 Powerplay Efficiency Comparison
Create dedicated powerplay analysis component:

```svelte
<!-- PowerplayAnalysis.svelte -->
<div class="powerplay-efficiency">
  <h3>Powerplay Efficiency Analysis</h3>
  
  <div class="metrics-grid">
    <div class="metric">
      <span class="label">Most Efficient</span>
      <span class="value">{mostEfficientTeam.name} ({mostEfficientTeam.minPerPPG}min)</span>
    </div>
    
    <div class="metric">
      <span class="label">League Average</span>
      <span class="value">{leagueAverage.toFixed(1)}min per goal</span>
    </div>
  </div>
</div>
```

#### 4.2 Historical Trending
Track powerplay efficiency trends over time:

```typescript
interface PowerplayTrend {
  date: string;
  minutesPerPowerplayGoal: number;
  movingAverage: number;
}

const getPowerplayTrends = async (teamId: string, dateRange: string[]) => {
  // Fetch historical powerplay data
  // Calculate trends and moving averages
};
```

### Phase 5: Caching Strategy (Future Implementation)

When ready to introduce caching to avoid overloading NHL APIs:

#### 5.1 Redis Caching Layer
```typescript
interface CacheStrategy {
  key: string;
  ttl: number; // Time to live in seconds
  refreshStrategy: 'background' | 'on-demand';
}

const POWERPLAY_CACHE_CONFIG: CacheStrategy = {
  key: 'powerplay_stats',
  ttl: 3600, // 1 hour
  refreshStrategy: 'background'
};
```

#### 5.2 Background Refresh Service
```typescript
class PowerplayStatsRefreshService {
  async refreshTeamPowerplayStats(teamId: string): Promise<void> {
    const stats = await nhlApiService.getTeamPowerplayStats(teamId, currentSeason);
    await cacheService.set(`powerplay:${teamId}`, stats, POWERPLAY_CACHE_CONFIG.ttl);
  }
}
```

## 🔧 Technical Implementation Details

### Data Flow Architecture
```
NHL API → GraphQL Resolver → Frontend Query → UI Display
    ↓
   [Future: Redis Cache Layer]
```

### Error Handling Strategy
```typescript
const handlePowerplayDataError = (error: Error, teamId: string) => {
  logger.warn(`Powerplay data unavailable for team ${teamId}`, { error });
  
  return {
    powerplayGoals: null,
    powerplayMinutes: null,
    minutesPerPowerplayGoal: null,
    powerplayOpportunities: null,
    powerplayPercentage: null
  };
};
```

### Rate Limiting Considerations
- **NHL API Rate Limits**: No documented limits, but implement respectful polling
- **Request Batching**: Batch multiple team requests where possible
- **Exponential Backoff**: Implement retry logic for failed requests

## 📊 UI/UX Design Considerations

### 1. Visual Indicators
- **Green**: Efficient powerplay (< 8 minutes per goal)
- **Yellow**: Average powerplay (8-12 minutes per goal)  
- **Red**: Inefficient powerplay (> 12 minutes per goal)

### 2. Sorting and Filtering
- **Default Sort**: Ascending (lower minutes per goal = better)
- **Filter Options**: Conference, division, top/bottom performers
- **Comparison Mode**: Side-by-side team comparisons

### 3. Tooltip Information
```
Minutes Per Powerplay Goal: 9.2
- Powerplay Goals: 25
- Powerplay Time: 230.5 minutes
- League Rank: 8th
- Efficiency Trend: ↗️ Improving
```

## 🧪 Testing Strategy

### 1. Unit Tests
```typescript
describe('Minutes Per Powerplay Goal Calculation', () => {
  test('calculates correct min_per_ppg for valid data', () => {
    const result = calculateMinPerPPG(10, 100);
    expect(result).toBe(10.0);
  });
  
  test('returns null for zero goals', () => {
    const result = calculateMinPerPPG(0, 100);
    expect(result).toBeNull();
  });
});
```

### 2. Integration Tests
```typescript
describe('Powerplay GraphQL Integration', () => {
  test('fetches powerplay stats from NHL API', async () => {
    const stats = await getPowerplayStats('TOR', '20242025');
    expect(stats).toHaveProperty('minutesPerPowerplayGoal');
  });
});
```

### 3. E2E Tests
```typescript
describe('Powerplay Stats Display', () => {
  test('displays min_per_ppg in standings table', async () => {
    await page.goto('/standings');
    const minPerPPG = await page.locator('[data-testid="min-per-ppg"]').first();
    expect(await minPerPPG.textContent()).toMatch(/\d+\.\d/);
  });
});
```

## 📈 Success Metrics

### 1. Performance Metrics
- **API Response Time**: < 500ms for powerplay data
- **Cache Hit Rate**: > 80% (when caching implemented)
- **Error Rate**: < 1% for API requests

### 2. User Experience Metrics
- **Page Load Time**: No impact on existing standings load time
- **Data Accuracy**: 100% match with official NHL powerplay statistics
- **User Engagement**: Track usage of new powerplay sorting/filtering

## 🚀 Deployment Strategy

### 1. Feature Flag Implementation
```typescript
interface FeatureFlags {
  powerplayStats: boolean;
  advancedPowerplayAnalysis: boolean;
}

const FEATURE_FLAGS: FeatureFlags = {
  powerplayStats: process.env.ENABLE_POWERPLAY_STATS === 'true',
  advancedPowerplayAnalysis: false // Future feature
};
```

### 2. Rollout Plan
1. **Alpha**: Internal testing with feature flag
2. **Beta**: Limited user group with powerplay stats enabled
3. **Production**: Full rollout with monitoring
4. **Enhancement**: Advanced analytics and caching

## 🔄 Future Enhancements

### 1. Advanced Analytics
- **Powerplay Efficiency Trends**: Historical performance tracking
- **Situational Analysis**: 5v4 vs 5v3 vs 4v3 efficiency
- **Player Impact**: Individual player powerplay contribution

### 2. Comparative Analysis
- **League Rankings**: Team powerplay efficiency rankings
- **Divisional Comparisons**: How teams compare within divisions
- **Historical Context**: Current season vs historical averages

### 3. Predictive Features
- **Powerplay Projection**: Season-end powerplay efficiency projections
- **Efficiency Correlation**: Relationship between PP efficiency and team success
- **Opponent Analysis**: Powerplay performance vs specific opponents

## 📝 Implementation Timeline

### Week 1: Foundation
- [ ] GraphQL schema extension
- [ ] NHL API integration research
- [ ] Basic resolver implementation

### Week 2: Backend Development
- [ ] NHL API service extension
- [ ] Powerplay data calculation logic
- [ ] Error handling and logging

### Week 3: Frontend Integration
- [ ] GraphQL query updates
- [ ] Domain model extension
- [ ] UI component enhancements

### Week 4: Testing & Polish
- [ ] Unit and integration tests
- [ ] UI/UX refinements
- [ ] Performance optimization
- [ ] Documentation updates

## 🎯 Acceptance Criteria

### Core Functionality
- ✅ Display minutes per powerplay goal for all teams
- ✅ Accurate calculation based on NHL API data
- ✅ Proper error handling for missing data
- ✅ Sortable and filterable in standings table

### Performance Requirements
- ✅ No impact on existing standings load time
- ✅ Graceful degradation when powerplay data unavailable
- ✅ Responsive UI updates

### Data Quality
- ✅ 100% accuracy with official NHL statistics
- ✅ Real-time updates during season
- ✅ Proper handling of edge cases (0 goals, etc.)

---

*This roadmap provides a comprehensive plan for implementing minutes per powerplay goal statistics while maintaining the application's performance and reliability standards.*