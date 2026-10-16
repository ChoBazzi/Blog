#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const collections = { posts: "blog", blog: "blog", notes: "notes", projects: "projects" };
const rows = [];
const help = `Read-only blog publication preflight (static checks, not fact verification).
Usage: node scripts/blog-check.mjs <path-or-slug> [--before path] [--build] [--links]

  --before path  Compare protected code, numbers, versions and URLs; changes block for human review.
  --build        Run existing npm run build after checking its scripts; writes build artifacts only.
  --links        Opt in to public HTTPS HEAD requests; restricted links remain unchanged.
  -h, --help     Show this help.

Examples:
  node scripts/blog-check.mjs content/blog/my-post.md
  node scripts/blog-check.mjs my-post --before /tmp/my-post-before.md
  node scripts/blog-check.mjs /tmp/dossier/article.md --build --links

Claims: adjacent <basename>.claims.md, otherwise adjacent claims.md.
Output: one JSON object per line: status, target, check, reason, mandatory.
Exit: 0 static checks pass; 1 required failure/unavailable; 2 invalid invocation.
A static PASS is not publication approval. Semantic evidence review remains required.
`;

function report(status, target, check, reason, mandatory = true) {
  const row = { status, target, check, reason, mandatory };
  rows.push(row);
  console.log(JSON.stringify(row));
}

async function isFile(file) {
  return fs.stat(file).then((stat) => stat.isFile(), () => false);
}

function frontmatter(raw) {
  if (!raw.startsWith("---\n")) return null;
  const end = raw.indexOf("\n---", 4);
  if (end < 0) return null;
  const data = {};
  for (const line of raw.slice(4, end).trim().split("\n")) {
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    data[key] = value === "true" ? true : value === "false" ? false
      : value.startsWith("[") && value.endsWith("]")
        ? value.slice(1, -1).split(",").map((item) => item.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
        : value.replace(/^["']|["']$/g, "");
  }
  return { data, body: raw.slice(end + 4).trim() };
}

function prose(raw) {
  return raw.replace(/^```[^\n]*\n[\s\S]*?^```[^\n]*$/gm, "").replace(/`[^`\n]+`/g, "");
}

function references(raw) {
  const refs = [];
  for (const match of prose(raw).matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)) refs.push(match[1]);
  for (const match of prose(raw).matchAll(/(?<!!)\[\[([^\]|\n]+)(?:\|[^\]\n]+)?\]\]/g)) refs.push(`/notes/${match[1]}`);
  return refs;
}

function secretLines(raw) {
  const patterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
    /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,})\b/,
    /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|authorization)\b\s*[=:]\s*["']?(?!(?:\$|<|process\.env|os\.environ|YOUR_|REDACTED|example|환경변수))[A-Za-z0-9+/_=-]{8,}/i,
    /https?:\/\/[^\s/:]+:[^\s/@]+@/,
    /[?&](?:token|key|api_key|access_token|password|secret)=[^\s&#)]+/i,
  ];
  return raw.split("\n").flatMap((line, index) => patterns.some((pattern) => pattern.test(line)) ? [index + 1] : []);
}

async function resolveTarget(input) {
  if (await isFile(path.resolve(input))) return path.resolve(input);
  if (input.includes("/") || input.endsWith(".md")) return null;
  const candidates = [];
  for (const collection of ["blog", "notes", "projects"]) {
    const candidate = path.join(root, "content", collection, `${input}.md`);
    if (await isFile(candidate)) candidates.push(candidate);
  }
  return candidates.length === 1 ? candidates[0] : null;
}

async function checkReference(ref, file, target, index, external) {
  const check = `reference:${index}`;
  if (/^https?:\/\//i.test(ref)) {
    external.add(ref);
    return;
  }
  if (/^(?:mailto:|tel:)/i.test(ref)) return;
  if (/^[a-z][a-z\d+.-]*:/i.test(ref) || ref.startsWith("//")) {
    report("FAIL", target, check, "Unsupported or unsafe URL scheme; use an explicit HTTPS URL or a local path.");
    return;
  }
  let decoded;
  try { decoded = decodeURIComponent(ref.split(/[?#]/)[0]); }
  catch { report("FAIL", target, check, "Invalid URL encoding; repair this reference."); return; }
  const fragment = ref.includes("#") ? ref.slice(ref.indexOf("#") + 1) : "";
  let destination = file;
  if (decoded.startsWith("/")) {
    const route = decoded.match(/^\/(posts|blog|notes|projects)\/([^/]+)\/?$/);
    if (route) destination = path.join(root, "content", collections[route[1]], `${route[2]}.md`);
    else if (["/", "/about", "/contact", "/posts", "/blog", "/notes", "/projects", "/dev-log", "/hobby", "/non-dev", "/kakaotech-bootcamp"].includes(decoded)) return;
    else destination = path.join(root, "public", decoded.slice(1));
  } else if (decoded) destination = path.resolve(path.dirname(file), decoded);
  if (!await isFile(destination)) {
    report("FAIL", target, check, "Local reference target is missing; repair the path or supply the referenced file (value withheld).");
    return;
  }
  if (destination.endsWith(".md") && fragment) {
    const text = await fs.readFile(destination, "utf8");
    const anchors = [...prose(text).matchAll(/^#{2,3} (.+)$/gm)].map((match) => match[1].toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, ""));
    let anchor;
    try { anchor = decodeURIComponent(fragment); } catch { anchor = null; }
    if (!anchors.includes(anchor)) report("FAIL", target, check, "Heading anchor is unavailable; use a rendered level-2/3 heading slug.");
  }
  if (decoded.startsWith("/") && destination.endsWith(".md")) {
    const parsed = frontmatter(await fs.readFile(destination, "utf8"));
    if (parsed?.data.published !== true) report("FAIL", target, check, "Linked article is unpublished or malformed; choose an accessible target before publication.");
  }
}

async function checkLedger(file, target, external) {
  const named = file.replace(/\.md$/, ".claims.md");
  const ledger = await isFile(named) ? named : path.join(path.dirname(file), "claims.md");
  if (!await isFile(ledger)) {
    report("FAIL", target, "claims", "Claims ledger missing; create adjacent <basename>.claims.md or claims.md using the documented table.");
    return;
  }
  const raw = await fs.readFile(ledger, "utf8");
  const suspects = secretLines(raw);
  if (suspects.length) report("FAIL", target, "ledger-secrets", `Credential-like content at ledger line(s) ${suspects.join(", ")}; redact and rotate genuine credentials. Values withheld.`);
  const table = raw.split("\n").filter((line) => line.trim().startsWith("|")).map((line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
  const columns = ["주장 ID", "본문 위치", "주장", "유형", "근거 위치·URL·버전", "근거 상태", "불확실성·한계", "본문 처리", "필수 여부"];
  const headerIndex = table.findIndex((row) => columns.every((column) => row.includes(column)));
  if (headerIndex < 0) {
    report("FAIL", target, "claims", "Claims ledger table is missing required columns; copy the documented nine-column format.");
    return;
  }
  const header = table[headerIndex];
  const claims = table.slice(headerIndex + 1).filter((row) => !row.every((cell) => /^:?-+:?$/.test(cell)));
  if (!claims.length) report("FAIL", target, "claims", "Claims ledger is empty; enumerate the article's material claims and evidence.");
  const start = rows.length;
  const ids = new Set();
  for (let index = 0; index < claims.length; index += 1) {
    const row = Object.fromEntries(header.map((column, cell) => [column, claims[index][cell] ?? ""]));
    const check = `claim:${index + 1}`;
    if (columns.some((column) => !row[column]) || ids.has(row["주장 ID"])) {
      report("FAIL", target, check, "Incomplete or duplicate claim row; fill every column and assign a unique ID.");
      continue;
    }
    ids.add(row["주장 ID"]);
    if (!["핵심", "보조"].includes(row["필수 여부"]) || !["작성자 진술", "원문 확인", "실행 검증", "미확인", "근거와 충돌"].includes(row["근거 상태"])) {
      report("FAIL", target, check, "Invalid claim priority/status; use the documented Korean enum values.");
    }
    if (row["필수 여부"] === "핵심" && ["미확인", "근거와 충돌"].includes(row["근거 상태"])) {
      report("FAIL", target, check, "Core claim is unknown or contradicted; obtain evidence or remove/reconcile the claim before review.");
    }
    const refs = references(row["근거 위치·URL·버전"]);
    if (row["근거 상태"] !== "미확인" && refs.length === 0) report("FAIL", target, check, "Evidence locator missing; supply a Markdown link to a local artifact or original source with location/version context.");
    for (let n = 0; n < refs.length; n += 1) await checkReference(refs[n], ledger, target, `claim-${index + 1}-${n + 1}`, external);
  }
  if (claims.length && rows.length === start) report("PASS", target, "claims", "Ledger structure and local evidence paths are present; statuses are author declarations, not verified facts.");
}

function protectedParts(raw) {
  return {
    code: raw.match(/^```[^\n]*\n[\s\S]*?^```[^\n]*$|`[^`\n]+`/gm) ?? [],
    numbers: raw.match(/\d+(?:[.,]\d+)*(?:%|ms|MB|GB|초|배)?/g) ?? [],
    versions: raw.match(/\bv?\d+\.\d+(?:\.\d+)?(?:-[\w.]+)?\b/g) ?? [],
    urls: raw.match(/https?:\/\/[^\s<>"')]+/g) ?? [],
    references: references(raw),
  };
}

async function checkLinks(external, target, enabled, secretFound) {
  if (!enabled) { report("SKIP", target, "external-links", "Network disabled; use --links only with permission. URLs are preserved.", false); return; }
  if (secretFound) { report("SKIP", target, "external-links", "Credential suspicion blocks network requests; redact and inspect links first."); return; }
  let index = 0;
  for (const ref of external) {
    index += 1;
    const check = `external-link:${index}`;
    let url;
    try { url = new URL(ref); } catch { report("FAIL", target, check, "Malformed URL; repair it without discarding the source."); continue; }
    // Exact public source hosts only; never follow redirects or send credentials.
    const hosts = ["nextjs.org", "react.dev", "nodejs.org", "typescriptlang.org", "developer.mozilla.org", "docs.github.com", "github.com", "docs.docker.com", "docs.python.org"];
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.port || !hosts.includes(url.hostname)) {
      report("SKIP", target, check, "URL is outside the exact public-source HTTPS allowlist or has credentials/query/nondefault port; review manually and retain it.");
      continue;
    }
    try {
      const response = await fetch(url, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(8000) });
      if (response.ok) report("PASS", target, check, `HTTP ${response.status}; reachability only, not source accuracy.`);
      else if ([401, 403, 405, 429].includes(response.status) || response.status >= 300 && response.status < 400) report("SKIP", target, check, `HTTP ${response.status}; access/redirect limits require manual verification. Keep the URL.`);
      else report("FAIL", target, check, `HTTP ${response.status}; investigate availability, do not automatically remove the citation.`);
      await response.body?.cancel();
    } catch { report("SKIP", target, check, "Link request unavailable or timed out; verify manually and keep the citation."); }
  }
  if (!external.size) report("PASS", target, "external-links", "No external links to probe.");
}

async function checkBuild(target, enabled) {
  if (!enabled) { report("SKIP", target, "build", "Build not requested; final verification requires --build or an independently recorded npm run build.", false); return; }
  const pkg = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
  if (pkg.scripts?.build !== "next build" || pkg.scripts?.prebuild || pkg.scripts?.postbuild) {
    report("SKIP", target, "build", "Build scripts differ from reviewed next build with no hooks; inspect script side effects before executing manually.");
    return;
  }
  if (!await isFile(path.join(root, "node_modules", "next", "package.json"))) {
    report("SKIP", target, "build", "Next dependency unavailable; install lockfile dependencies with npm ci, then rerun --build.");
    return;
  }
  const code = await new Promise((resolve) => {
    const child = spawn("npm", ["run", "build"], { cwd: root, stdio: "ignore", shell: false });
    child.on("error", () => resolve(null));
    child.on("exit", (exit) => resolve(exit));
  });
  report(code === 0 ? "PASS" : code === null ? "SKIP" : "FAIL", target, "build", code === 0
    ? "Reviewed npm run build completed; Next may write .next, next-env.d.ts and TypeScript cache artifacts."
    : "npm run build failed or unavailable; run it directly to inspect local diagnostics (build output withheld to avoid leaking values).");
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args.includes("--help") || args.includes("-h")) { console.log(help); return; }
  let input;
  let before;
  let build = false;
  let links = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--before" && args[index + 1] && !args[index + 1].startsWith("-")) before = args[++index];
    else if (arg === "--build") build = true;
    else if (arg === "--links") links = true;
    else if (!arg.startsWith("-") && !input) input = arg;
    else { report("FAIL", "invocation", "usage", "Invalid arguments; run node scripts/blog-check.mjs --help."); process.exitCode = 2; return; }
  }
  if (!input) { report("FAIL", "invocation", "usage", "Article target required; run with a Markdown path or unique slug."); process.exitCode = 2; return; }
  const file = await resolveTarget(input);
  const target = file ? path.relative(root, file) : "article";
  if (!file || !file.endsWith(".md")) { report("FAIL", target, "target", "Markdown target missing or slug ambiguous; supply an existing explicit .md path."); process.exitCode = 1; return; }
  const raw = await fs.readFile(file, "utf8");
  const parsed = frontmatter(raw);
  const external = new Set();
  if (!parsed) report("FAIL", target, "frontmatter", "Frontmatter missing/unclosed; use the existing --- delimited single-line field format and LF newlines.");
  else {
    const { data } = parsed;
    const invalid = ["title", "description"].filter((key) => typeof data[key] !== "string" || !data[key].length);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date ?? ""))) invalid.push("date");
    if (!Array.isArray(data.tags)) invalid.push("tags");
    if (typeof data.published !== "boolean") invalid.push("published");
    report(invalid.length ? "FAIL" : "PASS", target, "frontmatter", invalid.length ? `Repair required field(s): ${invalid.join(", ")}; date YYYY-MM-DD, tags inline array, published boolean.` : "Existing required frontmatter fields match the repository validator.");
  }
  const unfinished = raw.split("\n").flatMap((line, index) => /\b(?:TODO|TBD|FIXME)\b|작성 예정|추후 작성|\]\(URL\)|\[(?:확인 필요|근거 필요)\]/i.test(line) ? [index + 1] : []);
  const openFence = (raw.match(/^```/gm) ?? []).length % 2 !== 0;
  report(unfinished.length || openFence ? "FAIL" : "PASS", target, "unfinished", unfinished.length || openFence ? `Unfinished markers at line(s) ${unfinished.join(", ") || "none"}${openFence ? "; unclosed code fence" : ""}; resolve before review.` : "No supported unfinished markers or unclosed code fence detected.");
  const suspects = secretLines(raw);
  report(suspects.length ? "FAIL" : "PASS", target, "secrets", suspects.length ? `Credential-like content at line(s) ${suspects.join(", ")}; redact and rotate genuine credentials. Values withheld.` : "No supported credential pattern detected; this is not a comprehensive secret scan.");
  const refStart = rows.length;
  if (/!\[\[[^\]]+\]\]/.test(raw)) report("FAIL", target, "references", "Obsidian embedded assets are unsupported; use Markdown images pointing to public assets.");
  if (/^\s*\[[^\]]+\]:\s*\S/m.test(prose(raw))) report("FAIL", target, "references", "Reference-style links are not supported by this renderer; use inline Markdown links.");
  const refs = references(parsed?.body ?? raw);
  if (typeof parsed?.data.cover === "string") refs.push(parsed.data.cover);
  for (let index = 0; index < refs.length; index += 1) await checkReference(refs[index], file, target, index + 1, external);
  if (rows.length === refStart) report("PASS", target, "references", "Supported local Markdown targets and heading anchors exist.");
  await checkLedger(file, target, external);
  if (before) {
    try {
      const old = await fs.readFile(path.resolve(before), "utf8");
      const previous = protectedParts(old);
      const current = protectedParts(raw);
      const changed = Object.keys(current).filter((key) => JSON.stringify(previous[key]) !== JSON.stringify(current[key]));
      report(changed.length ? "FAIL" : "PASS", target, "protected-diff", changed.length ? `Human review required for changed ${changed.join(", ")}; inspect the original diff and evidence. No changed values are printed.` : "No protected-token changes detected; certainty, meaning and claim strength still require semantic review.");
    } catch { report("SKIP", target, "protected-diff", "Before snapshot unavailable; provide a readable --before path and retry."); }
  } else report("SKIP", target, "protected-diff", "No --before snapshot; edit workflows must supply one.", false);
  await checkLinks(external, target, links, rows.some((row) => row.check.includes("secrets") && row.status === "FAIL"));
  await checkBuild(target, build);
  report("SKIP", target, "semantic-review", "Static checks cannot establish truth, version applicability, tutorial completeness or certainty preservation; evidence-based human/LLM review remains required.", false);
  process.exitCode = rows.some((row) => row.mandatory && row.status !== "PASS") ? 1 : 0;
}

try { await main(); }
catch { report("SKIP", "article", "unavailable", "Required input/check unavailable; inspect file permissions, JSON package metadata and Node installation, then rerun."); process.exitCode = 1; }
