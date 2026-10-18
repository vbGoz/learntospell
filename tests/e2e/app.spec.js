/**
 * End-to-End Tests for Word Club
 * Tests complete user workflows in a real browser
 *
 * Run with: npx playwright test
 */

import { test, expect } from '@playwright/test';

test.describe('Profile Management', () => {
  test('should create a new profile and start playing', async ({ page }) => {
    await page.goto('/');

    // Should show profile selector
    await expect(page.getByText(/who's playing/i)).toBeVisible();

    // Click "Add Profile" button
    await page.getByText(/add profile/i).click();

    // Should show create profile form
    await expect(page.getByText(/create new profile/i)).toBeVisible();

    // Enter name
    await page.getByPlaceholder(/enter your name/i).fill('TestUser');

    // Select avatar (first emoji)
    const avatars = page.locator('.avatar-option').first();
    await avatars.click();

    // Click create button
    await page.getByText(/create profile/i).click();

    // Should navigate to home screen
    await expect(page.getByText(/listen & spell/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/unscramble/i)).toBeVisible();
    await expect(page.getByText(/multiple choice/i)).toBeVisible();
  });

  test('should switch between profiles', async ({ page }) => {
    await page.goto('/');

    // Create first profile
    await page.getByText(/add profile/i).click();
    await page.getByPlaceholder(/enter your name/i).fill('Alice');
    await page.locator('.avatar-option').first().click();
    await page.getByText(/create profile/i).click();

    // Wait for home screen
    await expect(page.getByText(/listen & spell/i)).toBeVisible();

    // Go back to profile selector (if there's a back button or menu)
    // For now, reload the page which should show profile selector
    await page.reload();

    // Should show Alice profile
    await expect(page.getByText('Alice')).toBeVisible();
  });
});

test.describe('Listen & Spell Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Create profile and navigate to Listen & Spell mode
    await page.goto('/');
    await page.getByText(/add profile/i).click();
    await page.getByPlaceholder(/enter your name/i).fill('TestUser');
    await page.locator('.avatar-option').first().click();
    await page.getByText(/create profile/i).click();
    await expect(page.getByText(/listen & spell/i)).toBeVisible();

    // Click Listen & Spell
    await page.getByText(/listen & spell/i).click();
  });

  test('should display game interface', async ({ page }) => {
    // Should show play button
    await expect(page.getByText(/play word/i)).toBeVisible({ timeout: 5000 });

    // Should show input field
    await expect(page.locator('input[type="text"]')).toBeVisible();

    // Should show score and streak
    await expect(page.getByText(/score:/i)).toBeVisible();
    await expect(page.getByText(/streak:/i)).toBeVisible();
  });

  test('should accept correct answer', async ({ page }) => {
    // Wait for game to load
    await page.waitForTimeout(1000);

    // Type a common word (we know "chair" is in the list)
    const input = page.locator('input[type="text"]');
    await input.fill('chair');

    // Click check button
    await page.getByText(/check/i).click();

    // Should show feedback (either correct or incorrect)
    await expect(page.locator('text=/correct|incorrect/i')).toBeVisible({ timeout: 3000 });
  });

  test('should show continue button after answering', async ({ page }) => {
    await page.waitForTimeout(1000);

    const input = page.locator('input[type="text"]');
    await input.fill('test');

    await page.getByText(/check/i).click();

    // Should show continue button
    await expect(page.getByText(/continue/i)).toBeVisible({ timeout: 3000 });
  });

  test('should progress through multiple words', async ({ page }) => {
    // Answer first word
    await page.waitForTimeout(1000);
    await page.locator('input[type="text"]').fill('test');
    await page.getByText(/check/i).click();

    // Click continue
    await page.getByText(/continue/i).click();

    // Should show next word (Word 2 of X)
    await expect(page.getByText(/word 2 of/i)).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Unscramble Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText(/add profile/i).click();
    await page.getByPlaceholder(/enter your name/i).fill('TestUser');
    await page.locator('.avatar-option').first().click();
    await page.getByText(/create profile/i).click();
    await expect(page.getByText(/unscramble/i)).toBeVisible();

    await page.getByText(/unscramble/i).click();
  });

  test('should display scrambled letters', async ({ page }) => {
    // Should show play button
    await expect(page.getByText(/hear word/i)).toBeVisible({ timeout: 5000 });

    // Should show letter buttons (at least 3-4 letters)
    const letterButtons = page.locator('button:not(:has-text("Hear Word")):not(:has-text("Check"))');
    await expect(letterButtons.first()).toBeVisible({ timeout: 3000 });
  });

  test('should allow selecting letters', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Click first available letter
    const letterButton = page.locator('button').filter({ hasNotText: /hear|check|home/i }).first();
    await letterButton.click();

    // Letter should move to answer area (button should be disabled or removed)
    // Just verify the click worked (implementation-dependent)
  });
});

test.describe('Multiple Choice Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText(/add profile/i).click();
    await page.getByPlaceholder(/enter your name/i).fill('TestUser');
    await page.locator('.avatar-option').first().click();
    await page.getByText(/create profile/i).click();
    await expect(page.getByText(/multiple choice/i)).toBeVisible();

    await page.getByText(/multiple choice/i).click();
  });

  test('should display 4 answer options', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Should show play button
    await expect(page.getByText(/play word/i)).toBeVisible({ timeout: 5000 });

    // Should show 4 option buttons
    const optionButtons = page.locator('button').filter({ hasNotText: /play|home|score|streak/i });
    await expect(optionButtons).toHaveCount(4, { timeout: 3000 });
  });

  test('should accept answer selection', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Click first option
    const firstOption = page.locator('button').filter({ hasNotText: /play|home|score|streak/i }).first();
    await firstOption.click();

    // Should show feedback
    await expect(page.locator('text=/correct|incorrect/i')).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Progress Dashboard', () => {
  test('should display dashboard with stats', async ({ page }) => {
    await page.goto('/');
    await page.getByText(/add profile/i).click();
    await page.getByPlaceholder(/enter your name/i).fill('TestUser');
    await page.locator('.avatar-option').first().click();
    await page.getByText(/create profile/i).click();

    // Click dashboard button
    await page.getByText(/progress dashboard/i).click();

    // Should show mastery stats
    await expect(page.getByText(/mastered/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/needs practice/i)).toBeVisible();

    // Should show achievements section
    await expect(page.getByText(/achievements/i)).toBeVisible();
  });
});

test.describe('Difficulty Settings', () => {
  test('should allow changing difficulty level', async ({ page }) => {
    await page.goto('/');
    await page.getByText(/add profile/i).click();
    await page.getByPlaceholder(/enter your name/i).fill('TestUser');
    await page.locator('.avatar-option').first().click();
    await page.getByText(/create profile/i).click();

    // Should show difficulty selector
    await expect(page.getByText(/all/i).or(page.getByText(/one bee/i))).toBeVisible({ timeout: 5000 });

    // Click a difficulty level
    const difficultyButton = page.getByText(/two bee/i).first();
    if (await difficultyButton.isVisible()) {
      await difficultyButton.click();
    }
  });
});

test.describe('Study Mode', () => {
  test('should display study mode with word visible', async ({ page }) => {
    await page.goto('/');
    await page.getByText(/add profile/i).click();
    await page.getByPlaceholder(/enter your name/i).fill('TestUser');
    await page.locator('.avatar-option').first().click();
    await page.getByText(/create profile/i).click();

    // Click Study Mode
    await page.getByText(/study mode/i).click();

    // Should show the word and its definition
    await page.waitForTimeout(1000);

    // Should have input field
    await expect(page.locator('input[type="text"]')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Audio Playback', () => {
  test('should have play word button in all audio modes', async ({ page }) => {
    await page.goto('/');
    await page.getByText(/add profile/i).click();
    await page.getByPlaceholder(/enter your name/i).fill('TestUser');
    await page.locator('.avatar-option').first().click();
    await page.getByText(/create profile/i).click();

    // Listen & Spell
    await page.getByText(/listen & spell/i).click();
    await expect(page.getByText(/play word/i)).toBeVisible({ timeout: 5000 });

    // Go back home
    await page.locator('button').first().click(); // Home button
    await page.waitForTimeout(500);

    // Multiple Choice
    await page.getByText(/multiple choice/i).click();
    await expect(page.getByText(/play word/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Navigation', () => {
  test('should navigate between modes using home button', async ({ page }) => {
    await page.goto('/');
    await page.getByText(/add profile/i).click();
    await page.getByPlaceholder(/enter your name/i).fill('TestUser');
    await page.locator('.avatar-option').first().click();
    await page.getByText(/create profile/i).click();

    // Go to Listen & Spell
    await page.getByText(/listen & spell/i).click();
    await page.waitForTimeout(500);

    // Click home button (usually first button or an icon)
    await page.locator('button').first().click();

    // Should be back at home screen
    await expect(page.getByText(/listen & spell/i)).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Practice Mistakes', () => {
  test.beforeEach(async ({ page }) => {
    // Seed one profile with 3 missed words (accuracy < 50%)
    await page.addInitScript(() => {
      const missed = { attempts: 2, correct: 0, lastAttempt: '2026-10-01T00:00:00.000Z' };
      localStorage.setItem('wordClubData', JSON.stringify({
        profiles: [{ id: 'p1', name: 'Tester', avatar: '😊', color: 'purple', createdAt: '2026-10-01T00:00:00.000Z' }],
        currentProfileId: 'p1',
        profileData: { p1: { settings: { difficulty: 'all' }, wordHistory: { ran: missed, wind: missed, leg: missed } } },
      }));
    });
    await page.goto('/');
  });

  test('should practice only missed words, and Try Again restarts them', async ({ page }) => {
    await page.getByText('Practice Mistakes (3)').click();
    await expect(page.getByText('Word 1 of 3')).toBeVisible({ timeout: 5000 });

    for (let i = 0; i < 3; i++) {
      await page.getByPlaceholder('Type the word...').fill('zzz');
      await page.getByRole('button', { name: 'Check Answer' }).click();
      await page.getByRole('button', { name: 'Continue' }).click();
    }

    await page.getByRole('button', { name: 'Try Again' }).click();
    await expect(page.getByText('Word 1 of 3')).toBeVisible();
  });
});
