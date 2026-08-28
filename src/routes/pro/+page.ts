import { dev } from '$app/environment';

// No dynamic data on this page, so it prerenders to a static asset.
export const csr = dev;
export const prerender = true;
