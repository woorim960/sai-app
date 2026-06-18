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

async function selectBalanceIfNeeded(page: import("@playwright/test").Page) {
  await page.waitForTimeout(350);

  const vs = page.getByText("VS", { exact: true });
  if (!(await vs.isVisible().catch(() => false))) return;

  const next = page.getByRole("button", { name: /다음 질문|결과 보기/ });
  if (await next.isEnabled()) return;

  await page.locator("main button").first().click();
  await expect(next).toBeEnabled({ timeout: 10000 });
}

async function playFullDeck(page: import("@playwright/test").Page) {
  await expect(page.getByText("1 / 15")).toBeVisible();

  for (let i = 0; i < 15; i += 1) {
    await selectBalanceIfNeeded(page);
    const label = i === 14 ? "결과 보기" : "다음 질문";
    const next = page.getByRole("button", { name: label });
    await expect(next).toBeEnabled({ timeout: 10000 });
    await next.click();
  }
}

test("async flow: 각자하기 → result → invite second player", async ({
  page,
  browser,
}) => {
  test.setTimeout(90_000);
  await completeOnboarding(page);
  await page.goto("/decks/blind-ice-breaking");

  await page.getByRole("link", { name: "각자하기" }).click();
  await expect(page).toHaveURL(/\/group\/[a-z0-9]+\/play/);

  const groupUrl = page.url();
  const groupId = groupUrl.match(/\/group\/([a-z0-9]+)\/play/)?.[1];
  expect(groupId).toBeTruthy();

  await playFullDeck(page);
  await expect(page).toHaveURL(new RegExp(`/group/${groupId}/result`));
  await expect(
    page.getByRole("button", { name: "친구 초대하고 비교하기" })
  ).toBeVisible();
  await expect(page.getByText("내 결과")).toBeVisible();
  await expect(
    page.getByText("2명 이상 플레이를 마치면 궁합 분석과 선택 분포가 열려요")
  ).toBeVisible();

  const guestContext = await browser.newContext();
  const guestPage = await guestContext.newPage();
  await completeOnboarding(guestPage);
  await guestPage.goto(`/invite/${groupId}`);

  await guestPage.getByLabel("닉네임").fill("지연");
  await guestPage.getByRole("button", { name: "참여하기" }).click();
  await expect(guestPage).toHaveURL(new RegExp(`/group/${groupId}/play`));

  await playFullDeck(guestPage);
  await expect(guestPage).toHaveURL(new RegExp(`/group/${groupId}/result`));
  await expect(guestPage.getByText("2명 완료 · 비교 가능")).toBeVisible();
  await expect(
    guestPage.getByRole("heading", { name: "하이라이트" })
  ).toBeVisible();
  await expect(
    guestPage.getByRole("heading", { name: "선택 분포" })
  ).toBeVisible();
  await expect(guestPage.getByText("민초파 VS 반민초파")).toBeVisible();
  await expect(
    guestPage.getByRole("heading", { name: "내가 고른 것들" })
  ).toBeVisible();

  await expect(page.getByText("2명 완료 · 비교 가능")).toBeVisible({
    timeout: 15000,
  });
  await expect(
    page.getByRole("heading", { name: "선택 분포" })
  ).toBeVisible();
  await expect(page.getByText("민초파 VS 반민초파")).toBeVisible();

  await guestContext.close();
});

test("premium deck unlock and 각자하기", async ({ page }) => {
  await completeOnboarding(page);
  await page.goto("/decks/some-closer");

  await page.getByRole("link", { name: "체험판 시작하기" }).click();
  await page.getByRole("link", { name: "각자하기" }).click();
  await expect(page).toHaveURL(/\/group\/[a-z0-9]+\/play/);
});

test("sync flow: 함께하기 lobby → start → first card", async ({
  page,
  browser,
}) => {
  test.setTimeout(60_000);
  await completeOnboarding(page);
  await page.goto("/decks/blind-ice-breaking");

  await page.getByRole("link", { name: "함께하기" }).click();
  await expect(page).toHaveURL(/\/room\/[a-z0-9]+\/?$/);

  const roomUrl = page.url();
  const groupId = roomUrl.match(/\/room\/([a-z0-9]+)/)?.[1];
  expect(groupId).toBeTruthy();

  const guestContext = await browser.newContext();
  const guestPage = await guestContext.newPage();
  await completeOnboarding(guestPage);
  await guestPage.goto(`/invite/${groupId}`);

  await guestPage.getByLabel("닉네임").fill("민수");
  await guestPage.getByRole("button", { name: "참여하기" }).click();
  await expect(guestPage).toHaveURL(new RegExp(`/room/${groupId}`));

  await page.getByRole("button", { name: "함께 시작하기" }).click();
  await expect(page).toHaveURL(new RegExp(`/room/${groupId}/play`));
  await expect(page.getByText("1 / 15")).toBeVisible({ timeout: 15000 });

  await expect(guestPage).toHaveURL(new RegExp(`/room/${groupId}/play`), {
    timeout: 15000,
  });
  await expect(guestPage.getByText("1 / 15")).toBeVisible();

  await guestContext.close();
});

test("onboarding middleware redirects unauthenticated home access", async ({
  page,
}) => {
  await page.goto("/home");
  await expect(page).toHaveURL(/\/onboarding/);
});
