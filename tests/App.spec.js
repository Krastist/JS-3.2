const { test, expect } = require("@playwright/test");
const { email, password } = require("../user.js");
const { describe } = require("node:test");
const { timeout } = require("../playwright.config.js");

describe("Authorization", async ({ page }) => {
  test("Success Authorization", async ({ page }) => {
    await page.goto("https://netology.ru/?modal=sign_in");
    await page.fill('[placeholder="Email"]', email);
    await page.fill('[placeholder="Пароль"]', password);
    await page.click('[data-testid="login-submit-btn"]');
    const profile = "https://netology.ru/profile";
    await expect(page).toHaveURL(profile);
    await page.waitForSelector('a:has-text("Моё обучение")');
    const title = await page.$eval(
      'a:has-text("Моё обучение")',
      (element) => element.textContent
    );
    const expectedTitle = "Моё обучение";
    expect(title).toBe(expectedTitle);
  });
  test("Failed Authorization", async ({ page }) => {
    await page.goto("https://netology.ru/?modal=sign_in");
    await page.fill('[placeholder="Email"]', "123456@mail.ru");
    await page.fill('[placeholder="Пароль"]', "123456");
    await page.click('[data-testid="login-submit-btn"]');
    await page.waitForSelector('[data-testid="login-error-hint"]', {
      timeout: 200,
    });
    const textError = await page.$eval(
      '[data-testid="login-error-hint"]',
      (element) => element.textContent
    );
    const expectedText = "Вы ввели неправильно логин или пароль";
    expect(textError).toBe(expectedText);
  });
});
