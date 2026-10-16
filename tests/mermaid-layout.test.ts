import assert from "node:assert/strict";
import test from "node:test";
// Node runs this TypeScript test directly and requires the explicit extension.
// @ts-expect-error TypeScript's bundler resolution disallows .ts import suffixes.
import { getMermaidLayout } from "../src/lib/mermaid-layout.ts";

test("horizontal flowcharts preserve a readable width", () => {
  assert.equal(getMermaidLayout("flowchart LR\n  a --> b"), "scroll");
  assert.equal(getMermaidLayout("graph RL\n  a --> b"), "scroll");
});

test("vertical flowcharts fit the article width", () => {
  assert.equal(getMermaidLayout("flowchart TB\n  a --> b"), "fit");
  assert.equal(getMermaidLayout("flowchart TD\n  a --> b"), "fit");
});

test("sequence diagrams preserve a readable width", () => {
  assert.equal(getMermaidLayout("sequenceDiagram\n  A->>B: request"), "scroll");
});
