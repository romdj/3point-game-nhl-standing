<script lang="ts">
  export let teamName: string;
  export let currentPosition: number;
  export let previousStandings: Record<string, number>;

  function getPositionChange(teamName: string, currentPosition: number, previousStandings: Record<string, number>) {
    if (!previousStandings[teamName]) {
      return { 
        icon: '•', 
        class: 'text-gray-400',
        tooltip: 'No previous data available'
      };
    }
    
    const prevPosition = previousStandings[teamName];
    const change = prevPosition - currentPosition;
    
    if (change > 0) {
      return { 
        icon: '↑', 
        class: 'text-green-500',
        tooltip: `Up ${change} position${change > 1 ? 's' : ''}`
      };
    } else if (change < 0) {
      return { 
        icon: '↓', 
        class: 'text-red-500',
        tooltip: `Down ${Math.abs(change)} position${Math.abs(change) > 1 ? 's' : ''}`
      };
    } else {
      return { 
        icon: '•', 
        class: 'text-gray-400',
        tooltip: 'No position change'
      };
    }
  }

  $: positionChange = getPositionChange(teamName, currentPosition, previousStandings);
</script>

<span 
  class="inline-flex items-center justify-center w-4 text-sm font-medium {positionChange.class}"
  title={positionChange.tooltip}
>
  {positionChange.icon}
</span>