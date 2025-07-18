<script lang="ts">
  import type { Standing } from '../../domain/standing';
  import TableSection from './TableSection.svelte';

  export let conferenceIndex: number;
  export let conferenceGroups: Record<string, Standing[]>;
  export let columns: Array<{ key: keyof Standing; label: string; width: string }>;
  export let sortKey: keyof Standing;
  export let sortOrder: 'asc' | 'desc';
  export let onSort: (_key: keyof Standing) => void;
  export let previousStandings: Record<string, number> = {};
  export let viewType: 'conference' | 'division' | 'wildcard';

  $: conferenceName = conferenceIndex === 0 ? 'Western Conference' : 'Eastern Conference';
  $: conferenceColor = conferenceIndex === 0 ? 'from-blue-600 to-blue-800' : 'from-red-600 to-red-800';
</script>

<div class="mb-8">
  <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
    <div class="bg-gradient-to-r {conferenceColor} text-white p-4">
      <h3 class="text-xl font-bold">
        {conferenceName}
      </h3>
    </div>
    
    <!-- Division sections for wildcard view -->
    {#if viewType === 'wildcard'}
      {#each Object.entries(conferenceGroups).filter(([name]) => !name.includes('Wild Card') && !name.includes('Race') && !name.includes('Rest')) as [groupName, groupTeams]}
        {#if groupTeams.length > 0}
          <TableSection 
            {groupName} 
            teams={groupTeams} 
            {columns} 
            {sortKey} 
            {sortOrder} 
            {onSort}
            {previousStandings}
            showSectionTitle={true}
          />
        {/if}
      {/each}
    {/if}
    
    <!-- Conference and division sections -->
    {#if viewType === 'conference' || viewType === 'division'}
      {#each Object.entries(conferenceGroups) as [groupName, groupTeams]}
        {#if groupTeams.length > 0}
          <TableSection 
            {groupName} 
            teams={groupTeams} 
            {columns} 
            {sortKey} 
            {sortOrder} 
            {onSort}
            {previousStandings}
            showSectionTitle={viewType === 'division'}
          />
        {/if}
      {/each}
    {/if}
  </div>
  
  <!-- Wild Card section - only for wildcard view -->
  {#if viewType === 'wildcard'}
    <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      {#each Object.entries(conferenceGroups).filter(([name]) => name.includes('Wild Card')) as [groupName, groupTeams]}
        {#if groupTeams.length > 0}
          <div class="bg-gradient-to-r from-green-600 to-green-800 text-white p-4">
            <h4 class="text-lg font-semibold flex items-center">
              <span class="mr-2">🌟</span>
              <span>Wild Card</span>
            </h4>
          </div>
          <TableSection 
            {groupName} 
            teams={groupTeams} 
            {columns} 
            {sortKey} 
            {sortOrder} 
            {onSort}
            {previousStandings}
            showSectionTitle={false}
          />
        {/if}
      {/each}
    </div>
    
    <!-- Race section -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      {#each Object.entries(conferenceGroups).filter(([name]) => name.includes('Race')) as [groupName, groupTeams]}
        {#if groupTeams.length > 0}
          <div class="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white p-4">
            <h4 class="text-lg font-semibold flex items-center">
              <span class="mr-2">🏁</span>
              <span>Playoff Race</span>
            </h4>
          </div>
          <TableSection 
            {groupName} 
            teams={groupTeams} 
            {columns} 
            {sortKey} 
            {sortOrder} 
            {onSort}
            {previousStandings}
            showSectionTitle={false}
          />
        {/if}
      {/each}
    </div>
    
    <!-- Rest section -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      {#each Object.entries(conferenceGroups).filter(([name]) => name.includes('Rest')) as [groupName, groupTeams]}
        {#if groupTeams.length > 0}
          <div class="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-4">
            <h4 class="text-lg font-semibold flex items-center">
              <span class="mr-2">📊</span>
              <span>Rest of Conference</span>
            </h4>
          </div>
          <TableSection 
            {groupName} 
            teams={groupTeams} 
            {columns} 
            {sortKey} 
            {sortOrder} 
            {onSort}
            {previousStandings}
            showSectionTitle={false}
          />
        {:else}
          <div class="p-8 text-center text-gray-500 italic">
            No teams in this group
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>