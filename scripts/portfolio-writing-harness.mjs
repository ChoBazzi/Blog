import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const strict = args.includes("--strict");
const json = args.includes("--json");
const filesArg = args.filter((arg) => !arg.startsWith("--"));
const targetFiles = filesArg.length > 0 ? filesArg : await defaultTargets();
const results = [];

for (const file of targetFiles) {
  const filepath = path.resolve(root, file);
  if (!filepath.endsWith(".md")) continue;

  const raw = await fs.readFile(filepath, "utf8").catch(() => null);
  if (raw === null) {
    results.push({
      file,
      score: 0,
      maxScore: 100,
      errors: [`file not found: ${file}`],
      warnings: [],
      strengths: [],
    });
    continue;
  }

  results.push(analyzeMarkdown(path.relative(root, filepath), raw));
}

if (json) {
  console.log(JSON.stringify({ strict, results }, null, 2));
} else {
  printReport(results);
}

const hasMissingFiles = results.some((result) => result.errors.some((error) => error.startsWith("file not found:")));
const hasStrictErrors = strict && results.some((result) => result.errors.length > 0);
const hasWeakStrictTarget = strict && results.some((result) => result.score < 72);

if (hasMissingFiles || hasStrictErrors || hasWeakStrictTarget) {
  process.exit(1);
}

async function defaultTargets() {
  const collections = ["projects", "blog"];
  const files = [];

  for (const collection of collections) {
    const dir = path.join(root, "content", collection);
    const filenames = await fs.readdir(dir).catch(() => []);
    for (const filename of filenames) {
      if (filename.endsWith(".md")) {
        files.push(path.join("content", collection, filename));
      }
    }
  }

  return files;
}

function analyzeMarkdown(file, raw) {
  const parsed = parseFrontmatter(raw);
  const body = parsed.body;
  const headings = extractHeadings(body);
  const bodyText = normalize(body);
  const title = String(parsed.data.title ?? "");
  const description = String(parsed.data.description ?? "");
  const isProjectCollection = file.startsWith(`content${path.sep}projects${path.sep}`) || file.startsWith("content/projects/");
  const isProjectCategory = String(parsed.data.category ?? "").toLowerCase().includes("project");

  const errors = [];
  const warnings = [];
  const strengths = [];
  let score = 0;

  if (!isProjectCollection && !isProjectCategory) {
    return {
      file,
      score: 100,
      maxScore: 100,
      errors,
      warnings: ["skipped: not a project portfolio article"],
      strengths: ["not applicable"],
    };
  }

  if (hasInlineArray(parsed.frontmatter, "tags")) score += 8;
  else warnings.push("frontmatter tags should use inline array syntax.");

  if (title.length >= 8 && !/draft|초안/i.test(title)) score += 6;
  else warnings.push("title should be concrete and publication-ready.");

  if (description.length >= 35 && /(문제|해결|설계|구현|회고|개선|운영|분석)/.test(description)) score += 8;
  else warnings.push("description should summarize the problem or technical angle, not only the stack.");

  score += sectionScore({
    label: "project context/problem",
    headings,
    bodyText,
    patterns: [/문제/, /배경/, /계기/, /상황/, /왜/, /목표/],
    warnings,
  });

  score += sectionScore({
    label: "role and scope",
    headings,
    bodyText,
    patterns: [/역할/, /담당/, /범위/, /구분/, /팀/, /개인 프로젝트/],
    warnings,
  });

  score += sectionScore({
    label: "implementation or architecture",
    headings,
    bodyText,
    patterns: [/구현/, /설계/, /아키텍처/, /구조/, /흐름/, /API/, /데이터/],
    warnings,
  });

  score += sectionScore({
    label: "tradeoffs or decisions",
    headings,
    bodyText,
    patterns: [/고민/, /트레이드오프/, /대안/, /선택/, /제약/, /대신/, /판단/],
    warnings,
  });

  score += sectionScore({
    label: "result or validation",
    headings,
    bodyText,
    patterns: [/결과/, /성과/, /검증/, /테스트/, /측정/, /사용자/, /배포/, /출시/],
    warnings,
  });

  score += sectionScore({
    label: "retrospective learning",
    headings,
    bodyText,
    patterns: [/배운 점/, /회고/, /아쉬/, /개선/, /다음/, /한계/],
    warnings,
  });

  if (/\d/.test(bodyText)) {
    score += 6;
    strengths.push("contains numeric evidence or concrete values.");
  } else {
    warnings.push("add concrete values when available: users, dates, latency, counts, versions, or test results.");
  }

  if (/```|!\[[^\]]*]\([^)]+\)|https?:\/\//.test(body)) {
    score += 6;
    strengths.push("contains technical artifact: code block, image, or external link.");
  } else {
    warnings.push("add a code block, architecture/data-flow block, screenshot, or repository/demo link when relevant.");
  }

  if (/(왜냐|때문|따라서|그래서|하지만|반면|대신|비교|기준|선택)/.test(bodyText)) {
    score += 6;
    strengths.push("contains reasoning connectors.");
  } else {
    warnings.push("explain why decisions were made; add reasoning connectors like '때문에', '대신', '비교하면'.");
  }

  if (/(작성 예정|TODO|TBD|FIXME|\[GitHub]\(URL\)|\[.*]\(URL\))/.test(body)) {
    errors.push("contains placeholder text that should be resolved before publication.");
  }

  if (/많이 배웠|좋은 경험|열심히|최선을/.test(bodyText) && !/(구체적으로|이후|전에는|다음에는|때문)/.test(bodyText)) {
    warnings.push("replace generic reflection with a concrete before/after learning.");
  }

  score = Math.min(score, 100);

  return {
    file,
    score,
    maxScore: 100,
    errors,
    warnings,
    strengths,
  };
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) {
    return { frontmatter: "", body: raw, data: {} };
  }

  const end = raw.indexOf("\n---", 4);
  if (end === -1) {
    return { frontmatter: "", body: raw, data: {} };
  }

  const frontmatter = raw.slice(4, end).trim();
  const body = raw.slice(end + 4).trim();
  const data = {};

  for (const line of frontmatter.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    data[key] = stripQuotes(value);
  }

  return { frontmatter, body, data };
}

function hasInlineArray(frontmatter, key) {
  const line = frontmatter
    .split("\n")
    .find((item) => item.trim().startsWith(`${key}:`));
  return Boolean(line && /\[[^\]]+]/.test(line));
}

function sectionScore({ label, headings, bodyText, patterns, warnings }) {
  const headingHit = headings.some((heading) => patterns.some((pattern) => pattern.test(heading)));
  const bodyHit = patterns.some((pattern) => pattern.test(bodyText));

  if (headingHit) return 10;
  if (bodyHit) return 6;

  warnings.push(`missing ${label} section or clear discussion.`);
  return 0;
}

function extractHeadings(body) {
  return body
    .split("\n")
    .filter((line) => /^#{2,3}\s+/.test(line))
    .map((line) => normalize(line.replace(/^#{2,3}\s+/, "")));
}

function normalize(value) {
  return value.replace(/\s+/g, " ").trim();
}

function stripQuotes(value) {
  return value.replace(/^["']|["']$/g, "");
}

function printReport(items) {
  console.log(`portfolio writing harness (${strict ? "strict" : "advisory"})`);

  for (const item of items) {
    const status = item.errors.length > 0 || (strict && item.score < 72) ? "FAIL" : item.score < 72 ? "WARN" : "PASS";
    console.log(`\n${status} ${item.file} (${item.score}/${item.maxScore})`);

    for (const error of item.errors) {
      console.log(`  error: ${error}`);
    }
    for (const warning of item.warnings.slice(0, 8)) {
      console.log(`  warn: ${warning}`);
    }
    if (item.warnings.length > 8) {
      console.log(`  warn: ${item.warnings.length - 8} more warnings omitted.`);
    }
    for (const strength of item.strengths.slice(0, 3)) {
      console.log(`  ok: ${strength}`);
    }
  }
}
