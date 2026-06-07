import { expect, test } from '@playwright/test';

test('renders the MVP dashboard and starts a run', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Momo Snake' })).toBeVisible();
  await expect(page.getByTestId('game-board')).toBeVisible();
  await page.getByTestId('start-button').click();
  await expect(page.getByText('Trajectory live')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByTestId('run-log')).toContainText('run started');
  await page.screenshot({ path: 'test-results/momo-snake-dashboard.png', fullPage: true });
});
