import { writable } from 'svelte/store';

export type ViewType = 'conference' | 'division' | 'wildcard' | 'league';

export const viewTypeStore = writable<ViewType>('conference'); 