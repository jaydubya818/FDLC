import assert from "node:assert/strict";

/** Exercises the small-factory teaching flows against the caller's local build. */
export async function checkSmallFactoryFlows(page, { origin, audit, report, width, output }) {
  await page.goto(`${origin}/simulator#morning-review`);
  const morning = page.locator("#morning-review");
  const selected = morning.locator("#morning-selected-work");
  await morning.getByRole("heading", { name: "Morning review", exact: true }).waitFor();
  assert.equal(await morning.locator(".morning-queue button").count(), 6);
  assert.equal(await morning.locator('.morning-queue button[aria-pressed="true"]').count(), 1);
  assert.match(await morning.locator(".morning-demo-note").innerText(), /synthetic.*Nothing connects to a live system/s);

  async function choose(title, keyboard = false) {
    const button = morning.locator(".morning-queue").getByRole("button", { name: new RegExp(title) });
    if (keyboard) {
      await button.focus();
      assert.ok(await button.evaluate(node => node === document.activeElement));
      await page.keyboard.press("Enter");
    } else await button.click();
    await selected.getByRole("heading", { name: title, exact: true }).waitFor();
    await page.waitForFunction(() => document.activeElement?.id === "morning-case-title");
    assert.equal(await button.getAttribute("aria-pressed"), "true");
    if (width === 390) {
      await page.waitForFunction(() => {
        const heading = document.getElementById("morning-case-title").getBoundingClientRect();
        return heading.top >= document.querySelector(".global-header").getBoundingClientRect().bottom - 1 && heading.top < innerHeight;
      });
    }
  }
  async function action(label, keyboard = false) {
    const button = selected.getByRole("button", { name: label, exact: true });
    if (keyboard) { await button.focus(); await page.keyboard.press("Enter"); }
    else await button.click();
    await page.waitForFunction(() => document.activeElement?.id === "morning-action-title");
  }
  async function phase(label) {
    await selected.locator(".morning-detail-heading").getByText(label, { exact: true }).waitFor();
  }
  async function rawReceipt(index = -1) {
    const history = selected.locator(".morning-receipts");
    if (await history.getAttribute("open") === null) await history.locator(":scope > summary").click();
    const rows = history.locator(":scope > ol > li");
    const row = index < 0 ? rows.nth((await rows.count()) + index) : rows.nth(index);
    const detail = row.locator("details");
    if (await detail.getAttribute("open") === null) await detail.locator("summary").click();
    return JSON.parse(await detail.locator("pre").innerText());
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await choose("A candidate is ready for your decision", true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await audit("morning-review-initial");
  await morning.screenshot({ path: new URL(`morning-review-${width}.png`, output).pathname });
  await action("Approve sample candidate", true);
  await phase("Action authorized");
  assert.match(await selected.locator(".morning-boundaries").innerText(), /Outcome\s+No action taken/);
  assert.equal(await selected.getByRole("button", { name: "Inspect the sample outcome", exact: true }).count(), 0);
  const decision = await rawReceipt();
  assert.equal(decision.actor, "sample-owner");
  assert.equal(decision.subject.candidateId, "CAND-DOCS-42/r1");
  assert.equal(decision.subject.factoryVersion, "docs-maintenance@1.2.0");
  assert.equal(decision.facts.productionAuthority, false);
  await action("Run the authorized sample action");
  await phase("Awaiting observation");
  assert.match(await selected.locator(".morning-boundaries").innerText(), /Not yet observed/);
  await action("Inspect the sample outcome");
  await phase("Outcome observed");
  assert.equal((await rawReceipt()).result, "MATCH_FOUND");

  await choose("A finished attempt failed verification");
  await phase("Verification failed");
  assert.equal(await selected.getByRole("button", { name: "Approve sample candidate", exact: true }).count(), 0);
  const failedEvidence = await rawReceipt();
  assert.equal(failedEvidence.result, "FAIL");
  assert.equal(failedEvidence.subject.candidateId, "CAND-DOCS-43/r1");
  await action("Make one bounded correction");
  await phase("Ready to verify");
  assert.match(await selected.locator(".morning-identities").innerText(), /CAND-DOCS-43\/r2/);
  assert.equal(await selected.getByRole("button", { name: "Make one bounded correction", exact: true }).count(), 0);
  await action("Verify the current candidate");
  await phase("Decision needed");
  const correctedEvidence = await rawReceipt();
  assert.equal(correctedEvidence.actor, "sample-verifier");
  assert.equal(correctedEvidence.result, "PASS");
  assert.equal(correctedEvidence.subject.candidateId, "CAND-DOCS-43/r2");
  assert.equal((await rawReceipt(1)).result, "FAIL", "failed evidence remains available after correction");
  assert.equal(await selected.getByRole("button", { name: "Run the authorized sample action", exact: true }).count(), 0);
  await audit("morning-review-correction-retains-failure");

  await choose("The candidate changed after approval");
  await phase("Evidence is stale");
  const oldDecision = await rawReceipt(2);
  assert.equal(oldDecision.subject.candidateId, "CAND-DOCS-45/r1");
  assert.equal(oldDecision.subject.factoryVersion, "docs-maintenance@1.2.0");
  assert.equal(await selected.getByRole("button", { name: "Approve sample candidate", exact: true }).count(), 0);
  await action("Verify the current candidate");
  await phase("Decision needed");
  assert.match(await selected.locator(".morning-boundaries").innerText(), /Needs a fresh decision/);
  await action("Approve sample candidate");
  await phase("Action authorized");
  const freshDecision = await rawReceipt();
  assert.equal(freshDecision.subject.candidateId, "CAND-DOCS-45/r2");
  assert.equal(freshDecision.subject.factoryVersion, "docs-maintenance@1.3.0");
  await audit("morning-review-fresh-evidence-and-decision");

  await choose("A write timed out. Did it happen?");
  await phase("Outcome unknown");
  assert.ok(await selected.getByRole("button", { name: "Retry is blocked", exact: true }).isDisabled());
  await action("Reconcile the sample target");
  await phase("Outcome observed");
  const found = await rawReceipt();
  assert.equal(found.result, "MATCH_FOUND");
  assert.equal(found.facts.additionalWrites, 0);
  assert.match(await selected.locator(".morning-limits").innerText(), /External attempts\s+1 simulated/);
  assert.equal(await selected.getByRole("button", { name: "Retry the sample action once", exact: true }).count(), 0);

  await morning.getByRole("button", { name: /Reset the morning/ }).click();
  await choose("A write timed out. Did it happen?");
  await selected.getByRole("radio", { name: "The operation is confirmed absent", exact: true }).check();
  await action("Reconcile the sample target");
  await phase("Ready for one retry");
  assert.equal((await rawReceipt()).result, "CONFIRMED_ABSENT");
  await action("Retry the sample action once");
  await phase("Awaiting observation");
  const retry = await rawReceipt();
  assert.equal(retry.facts.operationKey, "OP-DOCS-44/r1");
  assert.equal(retry.facts.attempt, 2);
  assert.equal(await selected.getByRole("button", { name: "Retry the sample action once", exact: true }).count(), 0);
  await action("Inspect the sample outcome");
  await phase("Outcome observed");
  await audit("morning-review-reconciled-bounded-retry");

  await choose("The work reached its spending limit");
  await phase("Budget exhausted");
  assert.equal(await selected.getByRole("button", { name: "Make one bounded correction", exact: true }).count(), 0);
  await action("Record a bounded stop");
  await phase("Stopped within limits");
  const stopped = await rawReceipt();
  assert.equal(stopped.result, "STOPPED");
  assert.equal(stopped.facts.requiresNewAuthorizedWorkOrderToContinue, true);
  assert.match(await selected.locator(".morning-limits").innerText(), /\$1\.00 \/ \$1\.00/);
  await audit("morning-review-budget-stop");

  await choose("Nothing eligible needs doing");
  await action("Repeat the sample scan");
  await phase("No eligible work");
  const empty = await rawReceipt();
  assert.equal(empty.subject.workOrderId, null);
  assert.equal(empty.subject.candidateId, null);
  assert.equal(empty.facts.workOrdersCreated, 0);
  assert.equal(empty.facts.externalWrites, 0);
  await audit("morning-review-no-work");
  await morning.getByRole("button", { name: /Reset the morning/ }).click();
  await phase("Decision needed");
  assert.match(await morning.locator(".morning-toolbar").innerText(), /1 decision waiting.*0 outcomes observed/s);
  assert.equal(await selected.locator(".morning-receipts > ol > li").count(), 2);
  report.flows.push({ name: "morning-review-six-cases-identity-recovery-receipts-keyboard-reset", width, result: "PASS" });

  await page.goto(`${origin}/start#operating-profile`);
  const profile = page.locator("#operating-profile");
  assert.equal(await profile.locator(":scope > details").getAttribute("open"), null);
  await profile.locator(":scope > details > summary").click();
  const generate = profile.getByRole("button", { name: "Generate operating profile", exact: true });
  assert.ok(await generate.isDisabled());
  await profile.getByLabel("Factory Definition reference", { exact: true }).fill("docs-maintenance / revision 1");
  await profile.getByLabel("Accountable operator or team", { exact: true }).fill("Documentation quality team");
  await profile.getByLabel("Eligible intake source and scope", { exact: true }).fill("Approved API changes in sample/docs");
  await profile.getByLabel("Intake trigger", { exact: true }).selectOption("schedule");
  await profile.locator("#profile-schedule").fill("Weekdays at 08:00");
  await profile.getByLabel("IANA time zone", { exact: true }).fill("Mars/Olympus_Mons");
  await profile.getByText("Use a valid IANA time zone, such as America/Chicago or UTC.", { exact: true }).waitFor();
  assert.ok(await generate.isDisabled());
  await profile.getByLabel("IANA time zone", { exact: true }).fill("America/Chicago");
  await profile.locator("#profile-concurrent").fill("3");
  await profile.getByText("Concurrent attempts cannot exceed the shared attempt limit.", { exact: true }).waitFor();
  assert.ok(await generate.isDisabled());
  await profile.locator("#profile-concurrent").fill("1");
  await generate.click();
  await profile.locator(".operating-profile-result").waitFor();
  await profile.getByText("View reusable Operating profile JSON", { exact: true }).click();
  const serialized = await profile.getByRole("textbox", { name: "Operating profile JSON artifact", exact: true }).inputValue();
  const exportedProfile = JSON.parse(serialized);
  assert.equal(exportedProfile.status, "design-only");
  assert.equal(exportedProfile.executionEnabled, false);
  assert.equal(exportedProfile.factoryDefinitionReference, "docs-maintenance / revision 1");
  assert.equal(exportedProfile.intake.trigger, "schedule");
  assert.equal(exportedProfile.intake.timezone, "America/Chicago");
  assert.equal(exportedProfile.intake.scheduleIntent, "Weekdays at 08:00");
  assert.equal(exportedProfile.sharedWorkOrderBudget.maxAttempts, 2);
  assert.equal(exportedProfile.sharedWorkOrderBudget.maxConcurrentAttempts, 1);
  assert.ok(exportedProfile.humanReview.requiredBinding.includes("Candidate digest"));
  await profile.getByRole("button", { name: "Copy operating profile", exact: true }).click();
  await profile.getByText("Copied to your clipboard.", { exact: true }).waitFor();
  assert.deepEqual(JSON.parse(await page.evaluate(() => navigator.clipboard.readText())), exportedProfile);
  const profileDownload = page.waitForEvent("download");
  await profile.getByRole("button", { name: "Download operating profile", exact: true }).click();
  const download = await profileDownload;
  assert.equal(download.suggestedFilename(), "factory-operating-profile-draft.json");
  let downloadedText = "";
  for await (const chunk of await download.createReadStream()) downloadedText += chunk.toString();
  assert.deepEqual(JSON.parse(downloadedText), exportedProfile);
  await audit("operating-profile-scheduled-export");
  await profile.screenshot({ path: new URL(`operating-profile-${width}.png`, output).pathname });
  await profile.getByLabel("Accountable operator or team", { exact: true }).fill("Updated documentation team");
  await profile.locator(".operating-profile-result").waitFor({ state: "detached" });
  assert.equal(await profile.getByRole("button", { name: "Copy operating profile", exact: true }).count(), 0, "editing invalidates the previously shown artifact");
  report.flows.push({ name: "operating-profile-schedule-validation-copy-download-invalidation", width, result: "PASS" });

  for (const preset of [
    { label: "Test repair", workType: "Test repair", outcome: /Repair one reproducible API regression/, criterion: /without changing the protected test/ },
    { label: "Documentation drift", workType: "Documentation update", outcome: /documentation that disagrees with an approved API contract/, criterion: /exact API contract or source revision/ },
  ]) {
    await page.goto(`${origin}/about`);
    await page.evaluate(() => sessionStorage.removeItem("fdlc.factory-definition.draft.v1"));
    await page.goto(`${origin}/start`);
    const builder = page.locator("#factory-builder");
    await builder.getByText("Start with a small factory", { exact: true }).click();
    await builder.getByRole("button", { name: preset.label, exact: true }).click();
    assert.equal(await builder.getByRole("combobox").inputValue(), preset.workType);
    assert.match(await builder.getByLabel("Describe the outcome", { exact: true }).inputValue(), preset.outcome);
    for (let step = 1; step <= 4; step += 1) {
      await builder.getByRole("button", { name: "Continue", exact: true }).click();
      await page.locator(`section[aria-label="Factory Definition builder, step ${step + 1} of 5"]`).waitFor();
    }
    await builder.getByRole("button", { name: "Generate Factory Definition", exact: true }).click();
    const result = page.locator(".factory-result");
    await result.getByRole("heading", { name: preset.workType, exact: true }).waitFor();
    assert.match(await result.innerText(), preset.criterion);
    await result.locator(".export-format-picker > summary").click();
    await result.getByRole("button", { name: "JSON", exact: true }).click();
    await result.getByText("View reusable JSON", { exact: true }).click();
    const definition = JSON.parse(await result.getByRole("textbox", { name: "JSON artifact", exact: true }).inputValue());
    assert.equal(definition.intent.workType, preset.workType);
    assert.match(definition.intent.outcome, preset.outcome);
    assert.ok(definition.verificationContract.includes("Tests"));
    assert.ok(definition.humanControls.includes("Merge"));
    assert.ok(definition.humanControls.includes("Production deployment"));
  }
  report.flows.push({ name: "small-factory-presets-produce-reviewable-definitions", width, result: "PASS" });

  await page.goto(`${origin}/lab#operate-a-small-factory`);
  const tutorial = page.locator("#operate-a-small-factory");
  await tutorial.getByRole("heading", { name: "Operate a small factory with a human near the loop.", exact: true }).waitFor();
  assert.equal(new URL(page.url()).hash, "#operate-a-small-factory");
  const commands = tutorial.getByRole("region", { name: "Small factory operating exercise", exact: true });
  assert.match(await commands.innerText(), /node operations\.mjs demo \.\/small-factory-demo/);
  assert.match(await commands.innerText(), /node operations\.mjs status \.\/small-factory-demo/);
  assert.match(await commands.innerText(), /node --test operations\.test\.mjs/);
  await commands.focus();
  assert.ok(await commands.evaluate(node => node === document.activeElement));
  await tutorial.getByRole("button", { name: "Copy operating exercise", exact: true }).click();
  await tutorial.getByRole("button", { name: "Copied", exact: true }).waitFor();
  assert.equal((await page.evaluate(() => navigator.clipboard.readText())).trim(), (await commands.innerText()).trim());
  await tutorial.locator(".tutorial-operating-details > summary").click();
  assert.match(await tutorial.getByRole("region", { name: "Persistent intake commands", exact: true }).innerText(), /enqueue \.\/my-small-factory api-check-001\nnode operations\.mjs enqueue \.\/my-small-factory api-check-001/);
  await audit("small-factory-operating-tutorial");
  const reviewLink = tutorial.getByRole("link", { name: /Practice all six decisions in the morning review/ });
  assert.equal(await reviewLink.getAttribute("href"), "/simulator#morning-review");
  await reviewLink.click();
  await page.waitForURL(`${origin}/simulator#morning-review`);
  await page.locator("#morning-review").getByRole("heading", { name: "Morning review", exact: true }).waitFor();
  report.flows.push({ name: "small-factory-tutorial-deep-link-commands-copy-review-handoff", width, result: "PASS" });

  await page.goto(`${origin}/factory-engineering#intake-to-review`);
  const playbook = page.locator("#intake-to-review");
  await playbook.getByRole("heading", { level: 2 }).waitFor();
  for (const id of ["admit-one-issue", "route-before-implementation", "prepare-the-review", "correlate-an-alert"]) {
    const example = playbook.locator(`#${id}`);
    assert.equal(await example.getAttribute("open"), null);
    const summary = example.locator(":scope > summary");
    await summary.focus();
    assert.ok(await summary.evaluate(node => node === document.activeElement));
    await page.keyboard.press("Enter");
    assert.notEqual(await example.getAttribute("open"), null);
    assert.equal(await example.getByRole("heading", { level: 3 }).count(), 2);
  }
  await audit("intake-to-review-all-disclosures-open");
  await playbook.screenshot({ path: new URL(`intake-to-review-${width}.png`, output).pathname });
  report.flows.push({ name: "intake-to-review-keyboard-disclosures-and-responsive-records", width, result: "PASS" });

  // A document navigation closes disclosures and discards temporary component state.
  await page.goto(`${origin}/about`);
}
