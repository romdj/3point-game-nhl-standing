<script lang="ts">
  import type { Standing } from '../domain/standing';
  import { standingsStore } from '../stores/standingsStore';
  import { viewTypeStore } from '../stores/viewStore';
  import { setSort } from '../utils/sorting';
  import { organizeStandings } from '../utils/standingsOrganizer';
  import { fade, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let sortOrder: 'desc' | 'asc' = 'desc';
  let standings: Standing[] = [];
  let sortKey: keyof Standing = 'internationalSystemPoints';
  
  // Track previous standings for position changes
  let previousStandings: Record<string, number> = {};

  standingsStore.subscribe((value) => {
    // Store previous positions before updating
    if (standings.length > 0) {
      previousStandings = standings.reduce((acc, team, index) => {
        acc[team.teamName] = index;
        return acc;
      }, {} as Record<string, number>);
    }
    
    standings = value;
    // Initial sort by points
    standings = setSort(standings, 'internationalSystemPoints', 'desc', 'internationalSystemPoints').sortedStandings;
  });

  function handleSort(key: keyof Standing) {
    if (sortKey === key) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortOrder = 'desc';
    }
    sortKey = key;
    const result = setSort(standings, sortKey, sortOrder, key);
    standings = result.sortedStandings;
    sortOrder = result.newSortOrder;
  }

  $: groupedStandings = organizeStandings(standings, $viewTypeStore, sortKey, sortOrder);

  // Fix the conferencePairs definition
  $: conferencePairs = ($viewTypeStore === 'conference' || $viewTypeStore === 'wildcard' || $viewTypeStore === 'division') ? 
    Object.entries(groupedStandings).reduce((acc, [name, teams]) => {
      if (name.includes('Western')) {
        if (!acc[0]) acc[0] = {};
        acc[0][name] = teams;
      }
      if (name.includes('Eastern')) {
        if (!acc[1]) acc[1] = {};
        acc[1][name] = teams;
      }
      return acc;
    }, [{}, {}] as Array<Record<string, Standing[]>>) : null;

  const columns: Array<{ key: keyof Standing; label: string; width: string }> = [
    { key: 'teamName', label: 'Team', width: 'w-48' },
    { key: 'gamesPlayed', label: 'GP', width: 'w-16' },
    { key: 'wins', label: 'W', width: 'w-16' },
    { key: 'losses', label: 'L', width: 'w-16' },
    { key: 'otLosses', label: 'OTL', width: 'w-16' },
    { key: 'points', label: 'PTS', width: 'w-16' },
    { key: 'internationalSystemPoints', label: 'IIHF PTS', width: 'w-20' },
  ];

  // Helper function to get section title and description
  function getSectionInfo(groupName: string) {
    if (groupName.includes('Wild Card')) {
      return {
        title: 'Wild Card',
        description: 'Current playoff qualifiers via wild card spots',
        icon: '🌟'
      };
    } else if (groupName.includes('Race')) {
      return {
        title: 'Playoff Race',
        description: 'Teams within 7 points of the final wild card spot',
        icon: '🏁'
      };
    } else if (groupName.includes('Rest')) {
      return {
        title: 'Rest of Conference',
        description: 'Teams more than 7 points out of a playoff spot',
        icon: '📊'
      };
    } else {
      // Division
      const divisionName = groupName.split(' - ')[1];
      return {
        title: divisionName,
        description: 'Top 3 teams qualify for playoffs',
        icon: '🏆'
      };
    }
  }

  // Get playoff status for styling
  function getPlayoffStatus(groupName: string, index: number): string {
    if (groupName.includes('Wild Card')) {
      return 'wildcard';
    } else if (!groupName.includes('Race') && !groupName.includes('Rest') && index < 3) {
      return 'division-leader';
    } else if (groupName.includes('Race')) {
      return 'race';
    }
    return 'non-playoff';
  }

  // Get team row background color based on status
  function getRowBackground(status: string): string {
    switch (status) {
      case 'division-leader': return 'bg-blue-50 hover:bg-blue-100';
      case 'wildcard': return 'bg-green-50 hover:bg-green-100';
      case 'race': return 'bg-yellow-50 hover:bg-yellow-100';
      default: return 'hover:bg-gray-50';
    }
  }
  
  // Get position change indicator
  function getPositionChange(teamName: string, currentIndex: number, _groupName: string): { icon: string, class: string } {
    if (!previousStandings[teamName]) {
      return { icon: '-', class: 'text-gray-400' };
    }
    
    const prevIndex = previousStandings[teamName];
    if (prevIndex < currentIndex) {
      return { icon: '↓', class: 'text-red-500' };
    } else if (prevIndex > currentIndex) {
      return { icon: '↑', class: 'text-green-500' };
    } else {
      return { icon: '-', class: 'text-gray-400' };
    }
  }
</script>

<div class="w-full max-w-7xl mx-auto px-4" in:fade={{ duration: 300, easing: quintOut }}>
  <div class="mb-6 flex flex-col sm:flex-row justify-between items-center bg-white rounded-lg shadow-sm p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">
      {$viewTypeStore.charAt(0).toUpperCase() + $viewTypeStore.slice(1)} Standings
    </h2>
  </div>

  <!-- All views now use the side-by-side layout for conferences -->
  {#if ($viewTypeStore === 'wildcard' || $viewTypeStore === 'conference' || $viewTypeStore === 'division') && conferencePairs}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" in:slide={{ duration: 400, easing: quintOut }}>
      {#each conferencePairs as conferenceGroups, i}
        <div class="mb-8">
          <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div class="bg-gradient-to-r {i === 0 ? 'from-blue-600 to-blue-800' : 'from-red-600 to-red-800'} text-white p-4">
              <h3 class="text-xl font-bold">
                {i === 0 ? 'Western Conference' : 'Eastern Conference'}
              </h3>
            </div>
            
            <!-- Division sections -->
            {#if $viewTypeStore === 'wildcard'}
              {#each Object.entries(conferenceGroups).filter(([name]) => !name.includes('Wild Card') && !name.includes('Race') && !name.includes('Rest')) as [groupName, groupTeams]}
                {#if groupTeams.length > 0}
                  {@const sectionInfo = getSectionInfo(groupName)}
                  <div class="p-4 border-b" transition:slide={{ duration: 300 }}>
                    <h4 class="text-md font-semibold mb-3 text-gray-700 flex items-center group relative">
                      <span class="mr-2">{sectionInfo.icon}</span>
                      <span>{sectionInfo.title}</span>
                      <!-- Tooltip on hover -->
                      <span class="invisible group-hover:visible absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-48">
                        {sectionInfo.description}
                      </span>
                    </h4>
                    <div class="overflow-x-auto rounded-lg">
                      <table class="min-w-full table-auto">
                        <thead>
                          <tr class="bg-gray-50">
                            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-16 border-b">Pos</th>
                            {#each columns as column}
                              <th 
                                class="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-b transition-colors duration-150"
                                on:click={() => handleSort(column.key)}
                              >
                                <div class="flex items-center space-x-1">
                                  <span>{column.label}</span>
                                  {#if sortKey === column.key}
                                    <span class="text-blue-500">
                                      {sortOrder === 'desc' ? '↓' : '↑'}
                                    </span>
                                  {/if}
                                </div>
                              </th>
                            {/each}
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                          {#each groupTeams as standing, index}
                            {@const status = getPlayoffStatus(groupName, index)}
                            {@const posChange = getPositionChange(standing.teamName, index, groupName)}
                            <tr class="transition-all duration-150 {getRowBackground(status)}">
                              <td class="px-3 py-3 text-sm font-medium {status === 'division-leader' ? 'text-blue-700' : 'text-gray-700'}">
                                <div class="flex items-center">
                                  <span class="mr-2">{index + 1}</span>
                                  <span class="{posChange.class}">{posChange.icon}</span>
                                </div>
                              </td>
                              {#each columns as column}
                                <td class="px-3 py-3 text-sm 
                                  {column.key === 'teamName' ? 'font-medium' : 'text-center'}
                                  {status === 'division-leader' && column.key === 'teamName' ? 'text-blue-700' : ''}">
                                  {standing[column.key]}
                                </td>
                              {/each}
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  </div>
                {/if}
              {/each}
            {/if}
            
            {#if $viewTypeStore === 'conference' || $viewTypeStore === 'division'}
              {#each Object.entries(conferenceGroups) as [groupName, groupTeams]}
                {#if groupTeams.length > 0}
                  {@const sectionInfo = getSectionInfo(groupName)}
                  <div class="p-4" transition:slide={{ duration: 300 }}>
                    {#if $viewTypeStore === 'division'}
                      <h4 class="text-md font-semibold mb-3 text-gray-700 flex items-center group relative">
                        <span class="mr-2">{sectionInfo.icon}</span>
                        <span>{sectionInfo.title}</span>
                        <!-- Tooltip on hover -->
                        <span class="invisible group-hover:visible absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-48">
                          {sectionInfo.description}
                        </span>
                      </h4>
                    {/if}
                    <div class="overflow-x-auto rounded-lg">
                      <table class="min-w-full table-auto">
                        <thead>
                          <tr class="bg-gray-50">
                            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-16 border-b">Pos</th>
                            {#each columns as column}
                              <th 
                                class="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-b transition-colors duration-150"
                                on:click={() => handleSort(column.key)}
                              >
                                <div class="flex items-center space-x-1">
                                  <span>{column.label}</span>
                                  {#if sortKey === column.key}
                                    <span class="text-blue-500">
                                      {sortOrder === 'desc' ? '↓' : '↑'}
                                    </span>
                                  {/if}
                                </div>
                              </th>
                            {/each}
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                          {#each groupTeams as standing, index}
                            {@const posChange = getPositionChange(standing.teamName, index, groupName)}
                            <tr class="hover:bg-gray-50 transition-colors duration-150">
                              <td class="px-3 py-3 text-sm font-medium text-gray-700">
                                <div class="flex items-center">
                                  <span class="mr-2">{index + 1}</span>
                                  <span class="{posChange.class}">{posChange.icon}</span>
                                </div>
                              </td>
                              {#each columns as column}
                                <td class="px-3 py-3 text-sm {column.key === 'teamName' ? 'font-medium' : 'text-center'}">
                                  {standing[column.key]}
                                </td>
                              {/each}
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  </div>
                {/if}
              {/each}
            {/if}
          </div>
          
          <!-- Wild Card section - only for wildcard view -->
          {#if $viewTypeStore === 'wildcard'}
            <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              {#each Object.entries(conferenceGroups).filter(([name]) => name.includes('Wild Card')) as [groupName, groupTeams]}
                {#if groupTeams.length > 0}
                  {@const sectionInfo = getSectionInfo(groupName)}
                  <div class="bg-gradient-to-r from-green-600 to-green-800 text-white p-4">
                    <h4 class="text-lg font-semibold flex items-center group relative">
                      <span class="mr-2">{sectionInfo.icon}</span>
                      <span>{sectionInfo.title}</span>
                      <!-- Tooltip on hover -->
                      <span class="invisible group-hover:visible absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-48">
                        {sectionInfo.description}
                      </span>
                    </h4>
                  </div>
                  <div class="p-4" transition:slide={{ duration: 300 }}>
                    <div class="overflow-x-auto rounded-lg">
                      <table class="min-w-full table-auto">
                        <thead>
                          <tr class="bg-gray-50">
                            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-16 border-b">Pos</th>
                            {#each columns as column}
                              <th 
                                class="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-b transition-colors duration-150"
                                on:click={() => handleSort(column.key)}
                              >
                                <div class="flex items-center space-x-1">
                                  <span>{column.label}</span>
                                  {#if sortKey === column.key}
                                    <span class="text-blue-500">
                                      {sortOrder === 'desc' ? '↓' : '↑'}
                                    </span>
                                  {/if}
                                </div>
                              </th>
                            {/each}
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                          {#each groupTeams as standing, index}
                            {@const posChange = getPositionChange(standing.teamName, index, groupName)}
                            <tr class="transition-all duration-150 bg-green-50 hover:bg-green-100">
                              <td class="px-3 py-3 text-sm font-medium text-green-700">
                                <div class="flex items-center">
                                  <span class="mr-2">{index + 1}</span>
                                  <span class="{posChange.class}">{posChange.icon}</span>
                                </div>
                              </td>
                              {#each columns as column}
                                <td class="px-3 py-3 text-sm 
                                  {column.key === 'teamName' ? 'font-medium' : 'text-center'}
                                  {column.key === 'teamName' ? 'text-green-700' : ''}">
                                  {standing[column.key]}
                                </td>
                              {/each}
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
            
            <!-- Race section -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              {#each Object.entries(conferenceGroups).filter(([name]) => name.includes('Race')) as [groupName, groupTeams]}
                {#if groupTeams.length > 0}
                  {@const sectionInfo = getSectionInfo(groupName)}
                  <div class="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white p-4">
                    <h4 class="text-lg font-semibold flex items-center group relative">
                      <span class="mr-2">{sectionInfo.icon}</span>
                      <span>{sectionInfo.title}</span>
                      <!-- Tooltip on hover -->
                      <span class="invisible group-hover:visible absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-48">
                        {sectionInfo.description}
                      </span>
                    </h4>
                  </div>
                  <div class="p-4" transition:slide={{ duration: 300 }}>
                    <div class="overflow-x-auto rounded-lg">
                      <table class="min-w-full table-auto">
                        <thead>
                          <tr class="bg-gray-50">
                            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-16 border-b">Pos</th>
                            {#each columns as column}
                              <th 
                                class="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-b transition-colors duration-150"
                                on:click={() => handleSort(column.key)}
                              >
                                <div class="flex items-center space-x-1">
                                  <span>{column.label}</span>
                                  {#if sortKey === column.key}
                                    <span class="text-blue-500">
                                      {sortOrder === 'desc' ? '↓' : '↑'}
                                    </span>
                                  {/if}
                                </div>
                              </th>
                            {/each}
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                          {#each groupTeams as standing, index}
                            {@const posChange = getPositionChange(standing.teamName, index, groupName)}
                            <tr class="transition-all duration-150 bg-yellow-50 hover:bg-yellow-100">
                              <td class="px-3 py-3 text-sm font-medium text-yellow-700">
                                <div class="flex items-center">
                                  <span class="mr-2">{index + 1}</span>
                                  <span class="{posChange.class}">{posChange.icon}</span>
                                </div>
                              </td>
                              {#each columns as column}
                                <td class="px-3 py-3 text-sm 
                                  {column.key === 'teamName' ? 'font-medium' : 'text-center'}
                                  {column.key === 'teamName' ? 'text-yellow-700' : ''}">
                                  {standing[column.key]}
                                </td>
                              {/each}
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
            
            <!-- Rest section -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
              {#each Object.entries(conferenceGroups).filter(([name]) => name.includes('Rest')) as [groupName, groupTeams]}
                {#if groupTeams.length > 0}
                  {@const sectionInfo = getSectionInfo(groupName)}
                  <div class="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-4">
                    <h4 class="text-lg font-semibold flex items-center group relative">
                      <span class="mr-2">{sectionInfo.icon}</span>
                      <span>{sectionInfo.title}</span>
                      <!-- Tooltip on hover -->
                      <span class="invisible group-hover:visible absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-48">
                        {sectionInfo.description}
                      </span>
                    </h4>
                  </div>
                  <div class="p-4" transition:slide={{ duration: 300 }}>
                    <div class="overflow-x-auto rounded-lg">
                      <table class="min-w-full table-auto">
                        <thead>
                          <tr class="bg-gray-50">
                            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-16 border-b">Pos</th>
                            {#each columns as column}
                              <th 
                                class="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-b transition-colors duration-150"
                                on:click={() => handleSort(column.key)}
                              >
                                <div class="flex items-center space-x-1">
                                  <span>{column.label}</span>
                                  {#if sortKey === column.key}
                                    <span class="text-blue-500">
                                      {sortOrder === 'desc' ? '↓' : '↑'}
                                    </span>
                                  {/if}
                                </div>
                              </th>
                            {/each}
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                          {#each groupTeams as standing, index}
                            {@const posChange = getPositionChange(standing.teamName, index, groupName)}
                            <tr class="transition-all duration-150 hover:bg-gray-50">
                              <td class="px-3 py-3 text-sm font-medium text-gray-700">
                                <div class="flex items-center">
                                  <span class="mr-2">{index + 1}</span>
                                  <span class="{posChange.class}">{posChange.icon}</span>
                                </div>
                              </td>
                              {#each columns as column}
                                <td class="px-3 py-3 text-sm 
                                  {column.key === 'teamName' ? 'font-medium' : 'text-center'}">
                                  {standing[column.key]}
                                </td>
                              {/each}
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  </div>
                {:else}
                  <div class="p-8 text-center text-gray-500 italic">
                    No teams in this group
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <!-- League View - Full Width -->
    <div class="space-y-8" in:slide={{ duration: 400, easing: quintOut }}>
      {#each Object.entries(groupedStandings) as [groupName, groupTeams]}
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4">
            <h3 class="text-xl font-bold group relative">
              {groupName}
              {#if groupName.includes('Wild Card')}
                <span class="ml-2 text-sm font-normal">(Playoff Qualifiers)</span>
              {/if}
              <!-- Tooltip on hover -->
              <span class="invisible group-hover:visible absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-48">
                League-wide standings
              </span>
            </h3>
          </div>
          
          {#if groupTeams.length > 0}
            <div class="p-4">
              <div class="overflow-x-auto rounded-lg">
                <table class="min-w-full table-auto">
  <thead>
                    <tr class="bg-gray-50">
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-16 border-b">Pos</th>
                      {#each columns as column}
                        <th 
                          class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-b transition-colors duration-150"
                          on:click={() => handleSort(column.key)}
                        >
                          <div class="flex items-center space-x-1">
                            <span>{column.label}</span>
                            {#if sortKey === column.key}
                              <span class="text-blue-500">
                                {sortOrder === 'desc' ? '↓' : '↑'}
                              </span>
                            {/if}
                          </div>
                        </th>
                      {/each}
    </tr>
  </thead>
                  <tbody class="divide-y divide-gray-200">
                    {#each groupTeams as standing, index}
                      {@const posChange = getPositionChange(standing.teamName, index, groupName)}
                      <tr class="hover:bg-gray-50 transition-all duration-150">
                        <td class="px-4 py-3 text-sm font-medium text-gray-700">
                          <div class="flex items-center">
                            <span class="mr-2">{index + 1}</span>
                            <span class="{posChange.class}">{posChange.icon}</span>
                          </div>
                        </td>
                        {#each columns as column}
                          <td class="px-4 py-3 text-sm {column.key === 'teamName' ? 'font-medium' : 'text-center'}">
                            {standing[column.key]}
                          </td>
                        {/each}
      </tr>
    {/each}
  </tbody>
</table>
              </div>
            </div>
          {:else}
            <div class="p-8 text-center text-gray-500 italic">
              No teams in this group
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  th {
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  /* Subtle hover effect for table rows */
  tr:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  /* Smooth transitions */
  tr, th, td {
    transition: all 0.2s ease;
  }
  
  /* Tooltip positioning */
  .group {
    position: relative;
  }
</style>
