import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";

export type Collection = "blog" | "notes" | "projects";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category?: string;
  cover?: string;
  published: boolean;
};

export type Post = PostMeta & {
  body: string;
  html: string;
  headings: Heading[];
};

const contentRoot = path.join(process.cwd(), "content");
const defaultCover = "/covers/default.svg";

export type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export const collectionLabels: Record<Collection, string> = {
  blog: "Dev log",
  notes: "Notes",
  projects: "Projects",
};

export const collectionPaths: Record<Collection, string> = {
  blog: "/posts",
  notes: "/notes",
  projects: "/projects",
};

export const getCollection = cache(async (collection: Collection) => {
  const dir = path.join(contentRoot, collection);
  const filenames = await fs.readdir(dir).catch(() => []);
  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md"))
      .map((filename) => readPost(collection, filename.replace(/\.md$/, ""))),
  );

  return posts
    .filter((post) => post.published)
    .sort((a, b) => b.date.localeCompare(a.date));
});

export const getPost = cache(async (collection: Collection, slug: string) => {
  const post = await readPost(collection, slug).catch(() => null);
  if (!post || !post.published) {
    notFound();
  }
  return post;
});

async function readPost(collection: Collection, slug: string): Promise<Post> {
  const filepath = path.join(contentRoot, collection, `${slug}.md`);
  const raw = await fs.readFile(filepath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const meta = normalizeMeta(data, slug);

  return {
    ...meta,
    cover: await resolveCover(meta.cover ?? extractFirstImage(body)),
    body,
    headings: extractHeadings(body),
    html: markdownToHtml(body),
  };
}

async function resolveCover(cover: string | undefined) {
  if (!cover) {
    return defaultCover;
  }

  if (!cover.startsWith("/")) {
    return cover;
  }

  const filepath = path.join(process.cwd(), "public", cover.slice(1));
  const exists = await fs
    .access(filepath)
    .then(() => true)
    .catch(() => false);

  return exists ? cover : defaultCover;
}

function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---\n")) {
    throw new Error("Markdown file must start with frontmatter.");
  }

  const end = raw.indexOf("\n---", 4);
  if (end === -1) {
    throw new Error("Markdown frontmatter must be closed with ---.");
  }

  const frontmatter = raw.slice(4, end).trim();
  const body = raw.slice(end + 4).trim();
  const data: Record<string, unknown> = {};

  for (const line of frontmatter.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    data[key] = parseValue(rawValue);
  }

  return { data, body };
}

function parseValue(value: string): unknown {
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

function stripQuotes(value: string) {
  return value.replace(/^["']|["']$/g, "");
}

function normalizeMeta(data: Record<string, unknown>, slug: string): PostMeta {
  return {
    slug,
    title: asString(data.title, "Untitled"),
    description: asString(data.description, ""),
    date: asString(data.date, "1970-01-01"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    category: typeof data.category === "string" ? data.category : undefined,
    cover: typeof data.cover === "string" ? data.cover : undefined,
    published: data.published === true,
  };
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function markdownToHtml(markdown: string) {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let code: string[] = [];
  let inCodeBlock = false;
  let codeLanguage = "";

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length > 0) {
      html.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`);
      list = [];
    }
  };

  const flushCode = () => {
    const source = code.join("\n");
    if (codeLanguage === "mermaid") {
      html.push(
        [
          '<section class="diagram-card" data-mermaid-diagram>',
          '<div class="diagram-card-header">',
          "<span>Architecture</span>",
          "<strong>System Flow</strong>",
          "</div>",
          '<div class="diagram-render" aria-live="polite"></div>',
          '<pre class="diagram-source"><code>',
          escapeHtml(source),
          "</code></pre>",
          "</section>",
        ].join(""),
      );
    } else {
      const languageClass = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : "";
      html.push(`<pre><code${languageClass}>${escapeHtml(source)}</code></pre>`);
    }
    code = [];
    codeLanguage = "";
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCode();
      } else {
        flushParagraph();
        flushList();
        codeLanguage = line.slice(3).trim().split(/\s+/)[0].toLowerCase();
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      code.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("::architecture ")) {
      flushParagraph();
      flushList();
      const mapId = line.slice("::architecture ".length).trim().split(/\s+/)[0];
      if (mapId) {
        html.push(`<div data-architecture-map="${escapeHtml(mapId)}"></div>`);
      }
      continue;
    }

    if (isTableStart(line, lines[index + 1])) {
      flushParagraph();
      flushList();
      const tableLines = [line, lines[index + 1]];
      index += 2;

      while (index < lines.length && isTableRow(lines[index])) {
        tableLines.push(lines[index]);
        index += 1;
      }

      index -= 1;
      html.push(renderTable(tableLines));
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      html.push(`<h1>${inline(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      const text = line.slice(3);
      html.push(`<h2 id="${slugify(text)}">${inline(text)}</h2>`);
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      const text = line.slice(4);
      html.push(`<h3 id="${slugify(text)}">${inline(text)}</h3>`);
      continue;
    }

    if (line.startsWith("#### ")) {
      flushParagraph();
      flushList();
      const text = line.slice(5);
      html.push(`<h4>${inline(text)}</h4>`);
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2));
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();

  return html.join("\n");
}

function isTableStart(line: string, nextLine: string | undefined) {
  return isTableRow(line) && Boolean(nextLine && isTableSeparator(nextLine));
}

function isTableRow(line: string | undefined) {
  return Boolean(line && line.trim().startsWith("|") && line.trim().endsWith("|"));
}

function isTableSeparator(line: string) {
  const cells = parseTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
}

function renderTable(lines: string[]) {
  const [headerLine, , ...bodyLines] = lines;
  const headers = parseTableRow(headerLine);
  const body = bodyLines.map(parseTableRow);

  return [
    '<div class="table-scroll">',
    "<table>",
    "<thead>",
    `<tr>${headers.map((cell) => `<th>${inline(cell.trim())}</th>`).join("")}</tr>`,
    "</thead>",
    "<tbody>",
    body
      .map((row) => `<tr>${headers.map((_, index) => `<td>${inline((row[index] ?? "").trim())}</td>`).join("")}</tr>`)
      .join(""),
    "</tbody>",
    "</table>",
    "</div>",
  ].join("");
}

function parseTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|");
}

function extractHeadings(markdown: string): Heading[] {
  return markdown
    .split("\n")
    .flatMap<Heading>((line) => {
      if (line.startsWith("## ") && !line.startsWith("### ")) {
        const text = line.slice(3).trim();
        return [{ id: slugify(text), text, level: 2 as const }];
      }

      if (line.startsWith("### ")) {
        const text = line.slice(4).trim();
        return [{ id: slugify(text), text, level: 3 as const }];
      }

      return [];
    });
}

function extractFirstImage(markdown: string) {
  const match = markdown.match(/!\[[^\]]*]\(([^)]+)\)/);
  return match?.[1];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function inline(text: string) {
  return escapeHtml(text)
    .replace(/&lt;br\s*\/?&gt;/gi, "<br />")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '<a href="/notes/$1">$2</a>')
    .replace(/\[\[([^\]]+)\]\]/g, '<a href="/notes/$1">$1</a>');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
