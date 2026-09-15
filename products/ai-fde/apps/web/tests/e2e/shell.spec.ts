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
    const mobile = width <= 1100;
    if (mobile)
      await page
        .getByRole("button", { name: "Open navigation", exact: true })
        .click();
    const navigation = page.getByRole("navigation", {
      name: mobile ? "Mobile navigation" : "Primary navigation",
      exact: true,
    });
    await expect(
      navigation.getByRole("link", { name: "AI-FDE", exact: true }),
    ).toHaveAttribute("href", "/deploy");
    const workspaceMenu = navigation.getByRole("button", {
      name: "AI-FDE navigation",
      exact: true,
    });
    await workspaceMenu.focus();
    await page.keyboard.press("ArrowDown");
    const workspaceLink = navigation.getByRole("link", {
      name: "Engagement workspace",
      exact: true,
    });
    await expect(workspaceLink).toBeFocused();
    await expect(workspaceLink).toHaveAttribute("href", "/deploy/app");
    await expect(workspaceLink).toHaveAttribute("aria-current", "page");
    await page.screenshot({
      path: testInfo.outputPath(`workspace-menu-${width}.png`),
      fullPage: false,
    });
    await page.keyboard.press("Escape");
    await expect(workspaceMenu).toBeFocused();
    await expect(workspaceMenu).toHaveAttribute("aria-expanded", "false");
    if (mobile) await expect(navigation).toBeVisible();
    await workspaceMenu.click();
    await workspaceLink.click();
    await expect(engagement).toBeVisible();
    if (mobile) await expect(navigation).toBeHidden();
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
