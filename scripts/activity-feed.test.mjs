import assert from "node:assert/strict";
import { test } from "node:test";
import { describeActivity } from "../src/lib/activity-feed.ts";

const event = { campaignId: "icewind", action: "CRIOU", entityType: "Arte", details: "/campaigns/icewind/artworks/drawing-1" };
test("supports legacy creation logs and direct artwork links", () => {
  assert.deepEqual(describeActivity(event), { text: "adicionou um desenho", kind: "artwork", href: event.details, deleted: false });
});
test("supports the current log vocabulary and diary edits", () => {
  assert.equal(describeActivity({ ...event, action: "criou", entityType: "Obra" }).text, "adicionou um desenho");
  assert.equal(describeActivity({ ...event, action: "EDITOU", entityType: "Entrada no Diário" }).text, "atualizou uma entrada do diário");
  assert.equal(describeActivity({ ...event, action: "criou", entityType: "Registro" }).text, "escreveu no diário");
});
test("deletions link to the section instead of a removed record", () => {
  assert.equal(describeActivity({ ...event, action: "EXCLUIU" }).href, "/campaigns/icewind/artworks");
});
test("ignores external links, other campaigns, and retired routes", () => {
  for (const details of ["https://example.com", "/campaigns/strahd/artworks/id", "/campaigns/icewind/npcs/id", "/campaigns/icewind/artworks/new/extra", "not a link"]) {
    assert.equal(describeActivity({ ...event, details }).href, "/campaigns/icewind/artworks");
  }
  assert.equal(describeActivity({ ...event, entityType: "NPC" }).href, "/campaigns/icewind");
});

test("old creation events fall back to the section after their target is deleted", () => {
  assert.equal(describeActivity(event, new Set()).href, "/campaigns/icewind/artworks");
  assert.equal(describeActivity(event, new Set([event.details])).href, event.details);
  const message = { ...event, entityType: "Correspondência", details: "/campaigns/icewind/messages#message-1" };
  assert.equal(describeActivity(message, new Set()).href, "/campaigns/icewind/messages");
  assert.equal(describeActivity(message, new Set([message.details])).href, message.details);
});
