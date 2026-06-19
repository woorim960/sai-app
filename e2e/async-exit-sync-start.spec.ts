import { test, expect } from "@playwright/test";

const ONBOARDING_COOKIE = "sai_onboarding_complete";

async function completeOnboarding(page: import("@playwright/test").Page) {
  await page.context().addCookies([
    {
      name: ONBOARDING_COOKIE,
      value: "true",
      domain: "localhost",
      path: "/",
    },
  ]);
}

test("async exit then sync start should show lobby", async ({ page }) => {
  test.setTimeout(60_000);
  await completeOnboarding(page);
  await page.goto("/decks/blind-ice-breaking");

  await page.getByRole("button", { name: /각자하기/ }).click();
  await expect(page).toHaveURL(/\/group\/[a-z0-9]+\/play/);
  await expect(page.getByText("1 / 15")).toBeVisible({ timeout: 15000 });

  // Exit during play
  await page.getByLabel("뒤로가기").click();
  await page.getByRole("button", { name: "나가기" }).click();
  await expect(page).toHaveURL(/\/decks\/blind-ice-breaking/);

  // Start sync play
  await page.getByRole("button", { name: /함께하기/ }).click();
  await expect(page).toHaveURL(/\/room\/[a-z0-9]+/);

  await expect(
    page.getByText("방을 찾을 수 없어요")
  ).not.toBeVisible({ timeout: 3000 });
  await expect(
    page.getByText("플레이를 찾을 수 없어요")
  ).not.toBeVisible({ timeout: 1000 });
  await expect(
    page.getByText("페이지를 찾을 수 없어요")
  ).not.toBeVisible({ timeout: 1000 });

  await expect(page.getByText("함께하기 · 친구를 초대하고")).toBeVisible({
    timeout: 15000,
  });
});
