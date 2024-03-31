export const TELEMETRY_DISABLED =
  window.SERVER_FLAGS?.telemetry?.DISABLED === 'true' ||
  window.SERVER_FLAGS?.telemetry?.DEVSANDBOX_DISABLED === 'true';

export const TELEMETRY_DEBUG = window.SERVER_FLAGS?.telemetry?.DEBUG === 'true';
