const RAW = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

export const config = {
  apiUrl: RAW && RAW.length > 0 ? RAW.replace(/\/$/, '') : 'http://localhost:4000',
  apiToken: (import.meta.env.VITE_API_TOKEN as string | undefined)?.trim() ?? '',
  appName: 'Roles Console',
  appVersion: (import.meta.env.VITE_APP_VERSION as string | undefined) ?? '1.0.0',
};
