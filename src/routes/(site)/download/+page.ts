import { dev } from '$app/environment';

// Nothing on this page needs script: links, a picture of the app and three
// steps. It ships none, so nothing on it may start hidden (the build-output
// test checks).
export const csr = dev;

// The page's own yellow is in its first block on every screen, and with no
// script the header cannot step back to ink when it comes into view, so it
// starts as ink here (Header.svelte reads this).
export const load = () => ({ headerCta: 'ink' as const });
