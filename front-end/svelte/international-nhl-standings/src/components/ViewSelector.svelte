<script lang="ts">
  import { viewTypeStore, type ViewType } from '../stores/viewStore';

  const views: { id: ViewType; label: string }[] = [
    { id: 'division', label: 'Division' },
    { id: 'wildcard', label: 'Wild Card' },
    { id: 'conference', label: 'Conference' },
    { id: 'league', label: 'League' }
  ];
</script>

<div class="flex justify-center space-x-2 mb-6">
  {#each views as view}
    <button
      class="px-4 py-2 rounded-lg transition-colors duration-200 {$viewTypeStore === view.id ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}"
      on:click={() => viewTypeStore.set(view.id)}
    >
      {view.label}
    </button>
  {/each}
</div> 