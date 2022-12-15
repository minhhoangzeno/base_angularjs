// CI: These value are placeholders and will get replace at runtime
export const environment = {
  production: Boolean('$SIMCEL_SAAS_PROD'),
  apiUrl: '$SIMCEL_SAAS_API_URL',
  rApiUrl: '$SIMCEL_SAAS_R_API_URL',
  profitExplorerUrl: '$SIMCEL_SAAS_PROFIT_EXPLORER_URL',
  forecastExplorerUrl: '$SIMCEL_SAAS_FORECAST_EXPLORER_URL',
  simulateUiUrl: '$SIMCEL_SAAS_SIMULATE_UI_URL',
  usersnapGlobalApiKey: '$SIMCEL_USERSNAP_GLOBAL_API_KEY',
  testUser: { token: {}, email: '' },
  validateDemandProcessing: false,
  version: '$SIMCEL_VERSION',
} as const;
