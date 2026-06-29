export const API_URL = import.meta.env.VITE_API_URL;
export const BASE_URL = import.meta.env.VITE_BASE_API_URL ?? API_URL ?? "";
export const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN ?? "";
export const CLIENT_CODE = import.meta.env.VITE_CLIENT_CODE ?? "";
export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
export const MAPBOX_STYLE_LINK = import.meta.env.VITE_APP_MAPBOX_STYLE_LINK;
export const INITIAL_CENTER: [number, number] = [85.40799, 27.72516];
export const INITIAL_ZOOM = 12;
