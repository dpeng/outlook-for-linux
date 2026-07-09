import { test, expect } from '@playwright/test';
import {
  startApp,
  findMainOutlookWindow,
  closeAndCleanup,
} from './helpers/electronApp.js';

test('app launches Outlook Web or Microsoft login', async () => {
  const ctx = await startApp({ prefix: 'outlook-e2e-' });

  try {
    expect(ctx.electronApp.windows().length).toBeGreaterThan(0);

    const mainWindow = findMainOutlookWindow(ctx.electronApp);
    expect(mainWindow).toBeTruthy();

    const hostname = new URL(mainWindow.url()).hostname;
    expect([
      'outlook.office.com',
      'outlook.office365.com',
      'outlook.live.com',
      'outlook.cloud.microsoft',
      'login.microsoftonline.com',
    ]).toContain(hostname);
  } finally {
    await closeAndCleanup(ctx);
  }
});
