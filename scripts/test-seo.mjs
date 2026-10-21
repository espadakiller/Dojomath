import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const cache = new Map();
function load(filename) {
  filename = path.resolve(filename);
  if (cache.has(filename)) return cache.get(filename);
  const exports = {};
  cache.set(filename, exports);
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports, URL, process: { env: {} },
    require(name) { return name.startsWith("@/") ? load(`${name.slice(2)}.ts`) : require(name); },
  }, { filename });
  return exports;
}

const { pageMetadata } = load("lib/metadata.ts");
const { publicPages, siteConfig } = load("lib/site.ts");
for (const page of publicPages) {
  const data = pageMetadata("Titre de la page", "Description propre à cette page", page);
  const url = new URL(page || "/", siteConfig.url).toString();
  assert.equal(data.alternates.canonical, url);
  assert.equal(data.openGraph.url, url);
  assert.equal(data.title.absolute, "Titre de la page | DojoMath");
  assert.equal(data.twitter.title, data.openGraph.title);
  assert.equal(data.twitter.description, data.description);
  assert.equal(data.openGraph.images[0].width, 1200);
}
const sitemap = load("app/sitemap.ts").default();
assert.equal(new Set(sitemap.map(item => item.url)).size, publicPages.length);
assert.ok(sitemap.some(item => item.url.endsWith("/ressources/calcul-fractions")));
assert.ok(!sitemap.some(item => /\/(admin|api|paiement)(\/|$)/.test(item.url)));
assert.ok(sitemap.every(item => item.lastModified === undefined));
const robots = load("app/robots.ts").default();
assert.ok(!robots.rules.disallow.includes("/admin"));
assert.equal(robots.sitemap, `${siteConfig.url}/sitemap.xml`);
console.log("SEO checks passed: branded metadata, canonical/social URL parity, unique public sitemap, resources discovery and no blocked noindex page.");
