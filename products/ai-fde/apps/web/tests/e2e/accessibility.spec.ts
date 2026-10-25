import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];

async function expectNoAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  expect(
    results.violations,
    JSON.stringify(results.violations, null, 2),
  ).toEqual([]);
}

async function openEngagementList(page: Page) {
  await page.goto("/deploy/app");
  await expect(page.getByText("Checking operator session")).toBeHidden();
  await expect(page.getByText("Loading engagements…")).toBeHidden();
}

async function openAcmeEngagement(page: Page) {
  await openEngagementList(page);
  const href = await page
    .getByRole("link", { name: /Acme Manufacturing/ })
    .last()
    .getAttribute("href");
  expect(href).toBeTruthy();
  await page.goto(href!);
  await expect(
    page.getByRole("heading", { level: 1, name: "Acme Manufacturing" }),
  ).toBeVisible();
}

test("engagement list has no WCAG A or AA axe violations", async ({ page }) => {
  await openEngagementList(page);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Define the factory before Mission Control runs it.",
    }),
  ).toBeVisible();

  await expectNoAccessibilityViolations(page);
});

test("unknown prefixed routes fail closed inside the AI-FDE shell", async ({
  page,
}) => {
  const response = await page.goto("/deploy/app/not-a-real-workspace");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "That AI-FDE route does not exist.",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "AI-FDE home" }).last().click();
  await expect(page).toHaveURL(/\/deploy\/app\/?$/);
});

test("FDLC global navigation is usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openEngagementList(page);
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  const navigation = page.getByRole("navigation", {
    name: "Mobile navigation",
  });
  await expect(
    navigation.getByRole("link", { name: "Framework", exact: true }),
  ).toHaveAttribute("href", "/framework");
  await expect(
    navigation.getByRole("link", { name: "AI-FDE", exact: true }),
  ).toHaveAttribute("href", "/deploy");
  await navigation
    .getByRole("button", { name: "AI-FDE navigation", exact: true })
    .click();
  await expect(
    navigation.getByRole("link", { name: "Engagement workspace", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    navigation.getByRole("link", { name: "Search the Guide", exact: true }),
  ).toHaveAttribute("href", "/guide/search");
  await expectNoAccessibilityViolations(page);
});

test("tablet and 200 percent reflow avoid horizontal page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await openEngagementList(page);
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});

test("a prefixed engagement deep link survives hard refresh", async ({
  page,
}) => {
  await openAcmeEngagement(page);
  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Acme Manufacturing" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/deploy\/app\/engagements\//);
});

test("engagement list preserves keyboard focus through disclosures", async ({
  page,
}) => {
  await openEngagementList(page);

  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to main content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const createButton = page.getByRole("button", { name: "New engagement" });
  await createButton.click();
  await expect(
    page.getByRole("textbox", { name: "Company name" }),
  ).toBeFocused();

  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(createButton).toBeFocused();
  await expect(createButton).toHaveAttribute("aria-expanded", "false");
});

test("full Operator Cockpit has no WCAG A or AA axe violations", async ({
  page,
}) => {
  await openAcmeEngagement(page);
  await expectNoAccessibilityViolations(page);
});

test("cockpit has one global masthead and an operational rail", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await openAcmeEngagement(page);
  await expect(
    page.getByRole("link", { name: "FDLC.ai home", exact: true }),
  ).toHaveCount(1);
  const rail = page.getByRole("complementary", {
    name: "Engagement navigation",
  });
  await expect(rail.getByRole("img")).toHaveCount(0);
  await expect(
    rail.getByRole("navigation", { name: "Engagement stages" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Factory Definition Workspace",
      exact: true,
    }),
  ).toBeVisible();
});

test("cockpit landmarks, disclosures, and scroll regions are keyboard reachable", async ({
  page,
}) => {
  await openAcmeEngagement(page);

  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to main content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const noteButton = page.getByRole("button", {
    name: "Add operator note as source evidence",
  });
  await noteButton.click();
  await expect(page.getByRole("textbox", { name: "Title" })).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Close operator note" }),
  ).toHaveAttribute("aria-expanded", "true");

  const specification = page.getByLabel(/^Generated .* Markdown$/);
  if (await specification.count()) {
    await expect(specification).toHaveAttribute("tabindex", "0");
  }
});

test("reduced-motion preference disables meaningful animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openAcmeEngagement(page);

  await expect
    .poll(() =>
      page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    )
    .toBe("auto");
});
