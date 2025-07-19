<script lang="ts">
  import { StandingsGroupingService } from '../../business';

  export let groupName: string;
  export let showDescription: boolean = true;

  const groupingService = new StandingsGroupingService();
  
  $: sectionInfo = groupingService.getSectionInfo(groupName);
</script>

<div class="flex items-center group relative">
  <span class="mr-2 text-lg">{sectionInfo.icon}</span>
  <span class="font-semibold">{sectionInfo.title}</span>
  
  {#if showDescription}
    <!-- Tooltip on hover -->
    <span class="invisible group-hover:visible absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-48 shadow-lg">
      {sectionInfo.description}
    </span>
  {/if}
</div>