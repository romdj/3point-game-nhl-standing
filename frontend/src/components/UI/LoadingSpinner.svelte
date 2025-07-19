<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let text: string = 'Loading...';
  export let centered: boolean = true;

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };
</script>

<div class="flex {centered ? 'justify-center' : ''} items-center py-8">
  <div class="animate-spin rounded-full {sizeClasses[size]} border-b-2 border-primary"></div>
  {#if text}
    <span class="ml-3 {textSizeClasses[size]} text-base-content/70">{text}</span>
  {/if}
</div>