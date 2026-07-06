import { test, expect } from '@playwright/test';

test.describe('Sekolah Rakyat CAT Login & Simulation', () => {
  test('should login and start active exam successfully', async ({ page }) => {
    // Go to homepage
    await page.goto('/');

    // Verify loading initializer finishes and page has header
    await expect(page.locator('h1')).toContainText('CAT BKN Sekolah Rakyat');

    // Fill credentials
    await page.fill('#name', 'Danis Arisandi');
    await page.fill('#participantId', 'BKN-2026-TEST');
    await page.fill('#instansi', 'Asrama SR Bandung');

    // Select Mode Ujian (default is 'ujian', let's click it explicitly to be sure)
    await page.click('text=Mode Ujian (CAT)');

    // Submit form
    await page.click('button:has-text("Mulai Simulasi Sekarang")');

    // Verify redirection to active exam room
    await expect(page.locator('header')).toContainText('ujian mode');
    await expect(page.locator('h3')).toContainText('Soal Nomor 1');
  });
});
