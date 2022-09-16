import { writable, type Writable } from 'svelte/store'

export const dark: Writable<boolean> = writable(false)
