<script lang="ts">
  import type { Standing } from '../../domain/standing';
  import { createComparisonData } from '../../utils/comparisonUtils';

  export let historical: Standing[];
  export let current: Standing[];
  export let historicalDate: string;
  export let currentDate: string;

  $: comparisonData = createComparisonData(historical, current);
  $: biggestMovers = comparisonData
    .filter(team => team.positionChange !== 0)
    .sort((a, b) => Math.abs(b.positionChange) - Math.abs(a.positionChange))
    .slice(0, 5);

  function getChangeColor(change: number): string {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-base-content/60';
  }

  function getChangeIcon(change: number): string {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '−';
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
</script>

<div class="space-y-6">
  <!-- Biggest Movers Summary -->
  {#if biggestMovers.length > 0}
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg mb-4">Biggest Position Changes</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {#each biggestMovers as team}
            <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
              <div class="flex items-center gap-3">
                {#if team.current.teamLogo}
                  <img 
                    src={team.current.teamLogo} 
                    alt="{team.current.teamName} logo"
                    class="w-8 h-8"
                    loading="lazy"
                  />
                {/if}
                <div>
                  <div class="font-medium text-sm">{team.current.teamName}</div>
                  <div class="text-xs text-base-content/60">
                    Pos {team.historicalPosition} → {team.currentPosition}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold {getChangeColor(team.positionChange)}">
                  {getChangeIcon(team.positionChange)}{Math.abs(team.positionChange)}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Full Comparison Table -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h3 class="card-title text-lg mb-4">
        Complete Standings Comparison
        <div class="text-sm font-normal text-base-content/60">
          {formatDate(historicalDate)} vs {formatDate(currentDate)}
        </div>
      </h3>

      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th class="text-left">Team</th>
              <th class="text-center">Position</th>
              <th class="text-center">Points</th>
              <th class="text-center">Games</th>
              <th class="text-center">Change</th>
            </tr>
          </thead>
          <tbody>
            {#each comparisonData as team}
              <tr class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    {#if team.current.teamLogo}
                      <img 
                        src={team.current.teamLogo} 
                        alt="{team.current.teamName} logo"
                        class="w-6 h-6"
                        loading="lazy"
                      />
                    {/if}
                    <div>
                      <div class="font-medium">{team.current.teamName}</div>
                      <div class="text-sm text-base-content/60">{team.current.divisionName}</div>
                    </div>
                  </div>
                </td>
                
                <td class="text-center">
                  <div class="flex items-center justify-center gap-2">
                    <span class="badge badge-outline">{team.historicalPosition}</span>
                    <span>→</span>
                    <span class="badge badge-primary">{team.currentPosition}</span>
                  </div>
                </td>
                
                <td class="text-center">
                  <div class="flex items-center justify-center gap-2">
                    <span class="text-base-content/60">{team.historical?.points || 0}</span>
                    <span>→</span>
                    <span class="font-medium">{team.current.points}</span>
                    <span class="text-sm {getChangeColor(team.pointsChange)}">
                      (+{team.pointsChange})
                    </span>
                  </div>
                </td>
                
                <td class="text-center">
                  <div class="flex items-center justify-center gap-2">
                    <span class="text-base-content/60">{team.historical?.gamesPlayed || 0}</span>
                    <span>→</span>
                    <span class="font-medium">{team.current.gamesPlayed}</span>
                  </div>
                </td>
                
                <td class="text-center">
                  {#if team.positionChange !== 0}
                    <div class="flex items-center justify-center gap-1">
                      <span class="text-lg {getChangeColor(team.positionChange)}">
                        {getChangeIcon(team.positionChange)}
                      </span>
                      <span class="font-medium {getChangeColor(team.positionChange)}">
                        {Math.abs(team.positionChange)}
                      </span>
                    </div>
                  {:else}
                    <span class="text-base-content/40">−</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>