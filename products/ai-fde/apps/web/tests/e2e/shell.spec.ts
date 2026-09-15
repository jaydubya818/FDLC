import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 768, 640, 390]) {
  test(`unified shell, engagement navigation and reflow at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });
    const errors: string[] = [];
    const apiRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("request", (request) => {
      if (request.url().includes("/api/")) apiRequests.push(request.url());
    });
    await page.goto("/deploy/app");
    const engagement = page.getByRole("link", {
      name: /Acme Manufacturing.*ACCOUNTS PAYABLE/i,
    });
    await expect(engagement).toBeVisible();
    await expect(
      page.getByRole("link", { name: "FDLC.ai home", exact: true }),
    ).toHaveCount(1);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`home-${width}.png`),
      fullPage: true,
    });
    await engagement.click();
    await expect(page).toHaveURL(/\/deploy\/app\/engagements\//);
    const engagementURL = page.url();
    await expect(
      page.getByRole("heading", { level: 1, name: "Acme Manufacturing" }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { level: 1, name: "Acme Manufacturing" }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await expect(
      page
        .getByRole("complementary", { name: "Engagement navigation" })
        .getByRole("img"),
    ).toHaveCount(0);
    await page.screenshot({
      path: testInfo.outputPath(`engagement-${width}.png`),
      fullPage: false,
    });
    await page
      .getByRole("link", { name: "Factory Definition Workspace", exact: true })
      .click();
    await expect(engagement).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(engagementURL);
    await expect(
      page.getByRole("heading", { level: 1, name: "Acme Manufacturing" }),
    ).toBeVisible();
    await page.goForward();
    await expect(engagement).toBeVisible();
    expect(errors).toEqual([]);
    expect(apiRequests).toEqual([]);
  });
}
