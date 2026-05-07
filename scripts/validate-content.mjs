import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentRoot = path.join(root, "content");
const collections = ["blog", "notes", "projects"];
const requiredFields = ["title", "description", "date", "tags", "published"];
const errors = [];
const warnings = [];

for (const collection of collections) {
  const dir = path.join(contentRoot, collection);
  const filenames = await fs.readdir(dir).catch(() => []);

  for (const filename of filenames) {
    if (!filename.endsWith(".md")) continue;

    const filepath = path.join(dir, filename);
    const relativePath = path.relative(root, filepath);
    const raw = await fs.readFile(filepath, "utf8");
    const parsed = parseFrontmatter(raw, relativePath);

    if (!parsed) continue;

    for (const field of requiredFields) {
      if (!(field in parsed.data)) {
        errors.push(`${relativePath}: missing frontmatter field "${field}".`);
      }
    }

    if (typeof parsed.data.title !== "string" || parsed.data.title.length === 0) {
      errors.push(`${relativePath}: title must be a non-empty string.`);
    }

    if (typeof parsed.data.description !== "string" || parsed.data.description.length === 0) {
      errors.push(`${relativePath}: description must be a non-empty string.`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(parsed.data.date ?? ""))) {
      errors.push(`${relativePath}: date must use YYYY-MM-DD.`);
    }

    if (!Array.isArray(parsed.data.tags)) {
      errors.push(`${relativePath}: tags must use inline array syntax, e.g. ["Next.js", "Docker"].`);
    }

    if (typeof parsed.data.published !== "boolean") {
      errors.push(`${relativePath}: published must be true or false.`);
    }

    if (/\[\[[^\]]+\]\]/.test(parsed.body)) {
      warnings.push(`${relativePath}: Obsidian wiki links are rendered as /notes/{slug}; verify target slugs.`);
    }

    if (/!\[\[[^\]]+\]\]/.test(parsed.body)) {
      warnings.push(`${relativePath}: Obsidian embedded assets are not supported yet; use Markdown image syntax.`);
    }
  }
}

for (const warning of warnings) {
  console.warn(`warn: ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`error: ${error}`);
  }
  process.exit(1);
}

console.log(`content validation passed (${collections.join(", ")})`);

function parseFrontmatter(raw, relativePath) {
  if (!raw.startsWith("---\n")) {
    errors.push(`${relativePath}: file must start with frontmatter.`);
    return null;
  }

  const end = raw.indexOf("\n---", 4);
  if (end === -1) {
    errors.push(`${relativePath}: frontmatter must be closed with ---.`);
    return null;
  }

  const frontmatter = raw.slice(4, end).trim();
  const body = raw.slice(end + 4).trim();
  const data = {};

  for (const line of frontmatter.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    data[key] = parseValue(rawValue);
  }

  return { data, body };
}

function parseValue(value) {
  if (value === "true") return true;
  if (value === "false") return false;

  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }

  return stripQuotes(value);
}

function stripQuotes(value) {
  return value.replace(/^["']|["']$/g, "");
}
