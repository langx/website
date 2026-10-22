import { dev } from '$app/environment';

// Nothing on this page needs script: links, a picture of the app and three
// steps. It ships none, so nothing on it may start hidden (the build-output
// test checks).
export const csr = dev;

// Its own yellow is in the first block, so the header starts ink: /download
// is in HERO_OWNS_PRIMARY (stores/cta.ts).
