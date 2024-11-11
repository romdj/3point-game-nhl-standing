import { writable } from 'svelte/store';
import type { Standing } from '../domain/standing';

export let standingsStore = writable<Standing[]>([]);
