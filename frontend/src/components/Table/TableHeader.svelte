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
  <tr>
    <th class="text-left font-semibold text-base-content w-16">Pos</th>
    {#each columns as column}
      <th 
        class="text-left font-semibold text-base-content cursor-pointer hover:bg-base-200 transition-colors duration-150 select-none"
        on:click={() => handleSort(column.key)}
      >
        <div class="flex items-center space-x-1">
          <span>{column.label}</span>
          {#if sortKey === column.key}
            <span class="text-primary text-sm">
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