const env = import.meta.env as Record<string, string | undefined>;

const readEnv = (key: string, fallback = "") => env[key]?.trim() || fallback;

export const API_URL = readEnv("VITE_API_URL", readEnv("VITE_BASE_API_URL"));
export const BASE_URL = readEnv("VITE_BASE_API_URL", API_URL);
export const BEARER_TOKEN = readEnv("VITE_BEARER_TOKEN");
export const CLIENT_CODE = readEnv("VITE_CLIENT_CODE");
export const APP_TITLE = readEnv("VITE_APP_TITLE", "Land Degradation Monitoring MIS System");
export const HEADING = readEnv("VITE_APP_HEADING", "Lakhandei River Basin Conservation Project");
export const SUBHEADING = readEnv("VITE_APP_SUBHEADING", "Division forest");
export const ADDRESS = readEnv("VITE_APP_ADDRESS", "Bagmati Province");
export const UI_APP_URL = `${window.location.protocol}//${window.location.host}`;

export const APP_META_DATA = {
  title: "Office_Of_Village_Executive",
  heading: "Thakre_Rural_Municipality",
  subheading: "Bagmati_Province,_Dhading,_Nepal",
  address: ADDRESS,
};
