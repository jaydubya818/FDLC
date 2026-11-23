import assert from "node:assert/strict";
import test from "node:test";
import { factoryUpdates, factoryUpdatesReviewed, fdlcCapabilities, fdlcStages } from "../../data/factory-updates.ts";

const touchpoints = new Set<string>([...fdlcStages, ...fdlcCapabilities]);

test("Factory Updates entries are complete, sourced, unique, and newest first", () => {
  assert.ok(factoryUpdates.length >= 6, "retain historical entries as the feed grows");
  assert.match(factoryUpdatesReviewed, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(factoryUpdatesReviewed <= new Date().toISOString().slice(0, 10), "review date must not be in the future");
  const ids = new Set<string>();
  const urls = new Set<string>();
  let previous = "9999-12-31";
  for (const update of factoryUpdates) {
    assert.match(update.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, update.id);
    assert.ok(!ids.has(update.id), `duplicate id ${update.id}`);
    ids.add(update.id);
    assert.match(update.date, /^\d{4}-\d{2}-\d{2}$/, update.id);
    assert.ok(!Number.isNaN(Date.parse(`${update.date}T00:00:00Z`)), update.id);
    assert.ok(update.date <= previous, `${update.id} is out of order`);
    assert.ok(update.date <= factoryUpdatesReviewed, `${update.id} is dated after the review date`);
    if (update.dateBasis) {
      assert.equal(update.dateBasis, "reviewed", update.id);
      assert.equal(update.kind, "Resource", `${update.id} must label an undated resource`);
    }
    if (update.kind) assert.ok(["Resource", "Perspective"].includes(update.kind), update.id);
    previous = update.date;
    assert.match(update.url, /^https:\/\//, update.id);
    assert.ok(!urls.has(update.url), `duplicate url ${update.url}`);
    urls.add(update.url);
    for (const field of [update.title, update.source, update.summary, update.whyItMatters]) assert.ok(field.trim().length > 0, update.id);
    assert.ok(touchpoints.has(update.touches), `${update.id} touches an unknown stage or capability`);
    assert.ok(update.whyItMatters.startsWith(`${update.touches}:`), `${update.id} why-it-matters should lead with its stage or capability`);
    assert.ok(update.tags.length > 0, update.id);
    if (update.guideReading) {
      assert.match(update.guideReading.href, /^\/guide\/[a-z0-9/-]+#[a-z0-9-]+$/, update.id);
      assert.ok(update.guideReading.label.trim().length > 0, update.id);
    }
  }
});
