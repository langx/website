import { dev } from '$app/environment';

// Pictures, four clips with the browser's own controls, and links. Nothing on
// the page needs script, so it ships none, and nothing on it may start hidden
// (the build-output test checks).
export const csr = dev;
