import assert from "node:assert/strict";

const moreLabels = ["In 5 Minutes", "Start", "Simulator", "Reference Lab", "Learning Library (Preview)", "Manifesto", "Enterprise", "About"];
const morePaths = ["/in-5-minutes", "/start", "/simulator", "/lab", "/corpus-preview", "/manifesto", "/enterprise", "/about"];
const primaryLabels = ["Framework", "Architecture", "Guide", "AI-FDE", "Mission Control", "Maturity", "More"];

export async function checkGlobalNavigation(page, { mobile, keyboard = false, touch = false }) {
  const header = page.locator("header").first();
  const headerLayout = await header.evaluate(node => {
    const logo = node.querySelector(".global-logo");
    const inner = node.querySelector(".global-header-inner");
    return { height: node.getBoundingClientRect().height, logoWidth: logo.getBoundingClientRect().width, display: getComputedStyle(inner).display, position: getComputedStyle(node).position };
  });
  assert.equal(headerLayout.position, "sticky", "The shared header stylesheet is loaded");
  assert.equal(headerLayout.display, "grid", "Header logo and navigation share one row");
  assert.ok(headerLayout.height >= 72 && headerLayout.height <= 90, "Header height stays within the responsive design system");
  assert.ok(headerLayout.logoWidth >= 180 && headerLayout.logoWidth <= 220, "The logo retains its intended size");
  const desktop = header.getByRole("navigation", { name: "Primary navigation", includeHidden: true });
  assert.deepEqual(await desktop.locator(":scope > a, :scope > .nav-dropdown:not(.nav-dropdown-linked) > button, :scope > .nav-dropdown-linked > a").allTextContents().then(labels => labels.map(label => label.replace("⌄", "").trim())), primaryLabels);
  const more = header.locator("#more-navigation");
  assert.deepEqual(await more.locator("a").allTextContents(), moreLabels);
  assert.deepEqual(await more.locator("a").evaluateAll(nodes => nodes.map(node => new URL(node.href).pathname)), morePaths);
  assert.equal(await header.locator('a[href$="/spec"], a[href$="/specification"], a[href$="/benchmarks"]').count(), 0);
  if (["/spec", "/specification", "/benchmarks"].includes(new URL(page.url()).pathname)) {
    assert.equal(await desktop.locator(".is-active, [aria-current=page]").count(), 0);
  }

  const trigger = mobile ? header.getByLabel("Open navigation", { exact: true }) : desktop.getByRole("button", { name: "More", exact: true });
  const panel = mobile ? header.locator("#mobile-navigation") : more;
  const activate = async () => touch ? trigger.tap() : trigger.click();
  await activate();
  // Retry once only if the initial click arrived before hydration.
  if (await trigger.getAttribute("aria-expanded") !== "true") await activate();
  await panel.waitFor({ state: "visible" });
  assert.equal(await trigger.getAttribute("aria-expanded"), "true");
  if (mobile) {
    const labels = await panel.locator(":scope > a").allTextContents();
    assert.deepEqual(labels.slice(-moreLabels.length), moreLabels);
  }
  if (mobile) {
    if (touch) await page.touchscreen.tap(8, 300);
    else await page.mouse.click(8, 300);
  } else await page.locator("main h1").click();
  await panel.waitFor({ state: "hidden" });
  assert.equal(await trigger.getAttribute("aria-expanded"), "false");

  if (keyboard) {
    for (const key of ["Enter", "Space"]) {
      await trigger.focus();
      await page.keyboard.press(key);
      await panel.waitFor({ state: "visible" });
      assert.equal(await trigger.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Tab");
      const firstLabel = mobile ? "Framework" : moreLabels[0];
      assert.equal(await page.evaluate(() => document.activeElement.textContent), firstLabel);
      await page.keyboard.press("End");
      assert.equal(await page.evaluate(() => document.activeElement.textContent), "About");
      await page.keyboard.press("ArrowDown");
      assert.equal(await page.evaluate(() => document.activeElement.textContent), firstLabel);
      await page.keyboard.press("ArrowUp");
      assert.equal(await page.evaluate(() => document.activeElement.textContent), "About");
      await page.keyboard.press("Home");
      assert.equal(await page.evaluate(() => document.activeElement.textContent), firstLabel);
      await page.keyboard.press("Escape");
      await panel.waitFor({ state: "hidden" });
      assert.equal(await trigger.getAttribute("aria-expanded"), "false");
      assert.ok(await trigger.evaluate(node => document.activeElement === node));
    }
    if (!mobile) {
      await trigger.focus();
      await page.keyboard.press("ArrowDown");
      await page.waitForFunction(() => document.activeElement?.textContent === "In 5 Minutes");
      for (const label of moreLabels.slice(1)) {
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement.textContent), label);
      }
      await page.keyboard.press("Tab");
      await panel.waitFor({ state: "hidden" });
      assert.equal(await panel.evaluate(node => node.contains(document.activeElement)), false, "Tab leaves the dropdown");
      await trigger.focus();
      await page.keyboard.press("ArrowDown");
      await page.waitForFunction(() => document.activeElement?.textContent === "In 5 Minutes");
      await page.keyboard.press("Shift+Tab");
      assert.ok(await trigger.evaluate(node => document.activeElement === node), "Shift+Tab returns to the trigger");
      await page.keyboard.press("Shift+Tab");
      await panel.waitFor({ state: "hidden" });
    }
  }
  const productNavigation = mobile ? header.locator("#mobile-navigation") : desktop;
  if (mobile) await header.getByLabel("Open navigation", { exact: true }).click();
  const productLink = productNavigation.getByRole("link", { name: "AI-FDE", exact: true });
  assert.equal(await productLink.getAttribute("href"), "/deploy", "AI-FDE opens the explanatory product page");
  const productTrigger = productNavigation.getByRole("button", { name: "AI-FDE navigation", exact: true });
  await productTrigger.focus();
  await page.keyboard.press("ArrowDown");
  const workspaceLink = productNavigation.getByRole("link", { name: "Engagement workspace", exact: true });
  await workspaceLink.waitFor({ state: "visible" });
  assert.equal(await workspaceLink.getAttribute("href"), "/deploy/app");
  await page.waitForFunction(() => document.activeElement?.textContent === "Engagement workspace");
  assert.ok(await workspaceLink.evaluate(node => document.activeElement === node));
  await page.keyboard.press("Escape");
  await workspaceLink.waitFor({ state: "hidden" });
  assert.ok(await productTrigger.evaluate(node => document.activeElement === node));
  if (mobile) {
    assert.ok(await productNavigation.isVisible(), "Escape closes the product dropdown before the mobile menu");
    await header.getByLabel("Open navigation", { exact: true }).click();
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
}
