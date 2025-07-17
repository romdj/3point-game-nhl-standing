import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.spec.{js,ts,jsx,tsx}'],
		environment: 'happy-dom',
		globals: true
	}
});
