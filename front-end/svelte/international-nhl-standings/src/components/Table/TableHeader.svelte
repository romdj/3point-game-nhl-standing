<script lang="ts">
  import type { Standing } from '../../domain/standing';

  export let columns: Array<{ key: keyof Standing; label: string; width: string }>;
  export let sortKey: keyof Standing;
  export let sortOrder: 'asc' | 'desc';
  export let onSort: (_key: keyof Standing) => void;

  const handleSort = (key: keyof Standing) => {
    onSort(key);
  };
</script>

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

<style>
  th {
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>