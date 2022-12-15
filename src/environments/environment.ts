/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',
  profitExplorerUrl: 'http://localhost:3837',
  forecastExplorerUrl: 'http://localhost:3836',
  rApiUrl: `http://localhost:8124`,
  simulateUiUrl: 'http://localhost:4300',
  usersnapGlobalApiKey: '58f54916-dcbc-427f-a45a-607d727d1fb7',
  testUser: {
    token: {
      expires_in: 3600000,
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ' +
        'pZCI6IjVlZTc0ZDdjOTA5ZjM0NDY3M2FmNjBkZiI' +
        'sInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHV' +
        'zZXIudXNlciIsImlhdCI6MTU5MzQxNzk4MSwiZXh' +
        'wIjoxNTkzNDIxNTgxfQ.OI1n_MnH4KuCBHa1Hy6e' +
        'Adw8Q9-9lnq-v_HqtXsrN8c',
    },
    email: 'user@user.user',
  },
  validateDemandProcessing: false,
  version: 'local',
} as const;