/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_BASE_API_URL: string;
  readonly VITE_CLIENT_CODE: string;
  readonly OUTPUT_FOLDER: string;
  readonly VITE_APP_MAPBOX_ACCESS_TOKEN: string;
  readonly VITE_APP_MAPBOX_STYLE_LINK: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly VITE_APP_TITLE: string;
  readonly VITE_BASE_API_URL: string;
  readonly VITE_CLIENT_CODE: string;
  readonly OUTPUT_FOLDER: string;
  readonly VITE_BEARER_TOKEN: string;
  readonly VITE_APP_MAPBOX_ACCESS_TOKEN: string;
}
