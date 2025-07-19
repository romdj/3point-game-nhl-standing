<script lang="ts">
  import { onMount } from 'svelte';
  import { themeStore } from '../stores/themeStore';
  import ThemeToggle from '../components/ThemeToggle.svelte';
  import '../app.css';

  onMount(() => {
    // Initialize theme when the app loads
    themeStore.initializeTheme();
  });
</script>

<div class="min-h-screen bg-base-100">
  <!-- Header -->
  <header class="navbar bg-base-100 shadow-sm border-b border-base-200">
    <div class="container mx-auto">
      <div class="flex-1">
        <a href="/" class="btn btn-ghost normal-case text-xl text-primary font-bold">
          🏒 NHL Standings
        </a>
        <div class="badge badge-secondary ml-2">3-Point System</div>
      </div>
      <div class="flex-none">
        <ThemeToggle />
      </div>
    </div>
  </header>

  <!-- Main content -->
  <main class="container mx-auto px-4 py-6">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="footer footer-center p-4 bg-base-200 text-base-content">
    <div>
      <p class="text-sm">
        Built with ❤️ using <a href="https://svelte.dev" class="link link-primary">Svelte</a> • 
        <a href="https://daisyui.com" class="link link-primary">DaisyUI</a> • 
        <a href="https://www.nhl.com" class="link link-primary">NHL API</a>
      </p>
    </div>
  </footer>
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .container {
    max-width: 1200px;
  }
</style>