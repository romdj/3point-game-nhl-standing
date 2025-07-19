<script lang="ts">
  export let status: 'division-leader' | 'wildcard' | 'race' | 'non-playoff';

  function getStatusInfo(status: string) {
    switch (status) {
      case 'division-leader':
        return {
          badge: 'DL',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          tooltip: 'Division leader - automatic playoff qualifier'
        };
      case 'wildcard':
        return {
          badge: 'WC',
          color: 'bg-green-100 text-green-800 border-green-200',
          tooltip: 'Wild card playoff qualifier'
        };
      case 'race':
        return {
          badge: 'R',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          tooltip: 'In playoff race'
        };
      default:
        return {
          badge: '',
          color: 'bg-gray-100 text-gray-600 border-gray-200',
          tooltip: 'Not in playoff position'
        };
    }
  }

  $: statusInfo = getStatusInfo(status);
</script>

{#if statusInfo.badge}
  <div 
    class="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full border {statusInfo.color}"
    title={statusInfo.tooltip}
  >
    {statusInfo.badge}
  </div>
{/if}