import { CategoryFilter } from "@/components/CategoryFilter";
import { CollectionHero } from "@/components/CollectionHero";
import { Pagination } from "@/components/Pagination";
import { PostCard } from "@/components/PostCard";
import { getCategories, getCategoryParam } from "@/lib/categories";
import type { Collection, PostMeta } from "@/lib/content";
import { getCollection } from "@/lib/content";
import { getPageNumber, paginate } from "@/lib/pagination";

const KATEBU_TAGS = new Set(["카테부", "카카오테크", "카카오테크 부트캠프", "kakaotech", "katebu"]);

const boards = [
  { value: "all", label: "All" },
  { value: "posts", label: "전체게시글" },
  { value: "dev-log", label: "Dev log" },
  { value: "notes", label: "공부 노트" },
  { value: "projects", label: "프로젝트" },
] as const;

type Board = (typeof boards)[number]["value"];

type BoardEntry = {
  board: Exclude<Board, "all">;
  collection: Collection;
  post: PostMeta;
};

type PageProps = {
  searchParams: Promise<{
    board?: string | string[];
    category?: string | string[];
    page?: string | string[];
  }>;
};

export const metadata = {
  title: "카카오테크 부트캠프",
};

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getBoard(value: string | string[] | undefined): Board {
  const board = getParam(value);
  return boards.some((item) => item.value === board) ? (board as Board) : "all";
}

function hasKatebuTag(post: PostMeta) {
  return post.tags.some((tag) => KATEBU_TAGS.has(tag.trim()));
}

function boardHref(board: Board) {
  return board === "all" ? "/kakaotech-bootcamp" : `/kakaotech-bootcamp?board=${board}`;
}

function getEntries(
  board: Board,
  posts: PostMeta[],
  notes: PostMeta[],
  projects: PostMeta[],
): BoardEntry[] {
  const taggedPosts = posts.filter(hasKatebuTag);
  const taggedNotes = notes.filter(hasKatebuTag);
  const taggedProjects = projects.filter(hasKatebuTag);

  if (board === "posts") {
    return taggedPosts.map((post) => ({ board: "posts", collection: "blog", post }));
  }

  if (board === "dev-log") {
    return taggedPosts
      .filter((post) => post.category !== "project")
      .map((post) => ({ board: "dev-log", collection: "blog", post }));
  }

  if (board === "notes") {
    return taggedNotes.map((post) => ({ board: "notes", collection: "notes", post }));
  }

  if (board === "projects") {
    return taggedProjects.map((post) => ({ board: "projects", collection: "projects", post }));
  }

  return [
    ...taggedPosts.map((post) => ({ board: "posts" as const, collection: "blog" as const, post })),
    ...taggedNotes.map((post) => ({ board: "notes" as const, collection: "notes" as const, post })),
    ...taggedProjects.map((post) => ({
      board: "projects" as const,
      collection: "projects" as const,
      post,
    })),
  ].sort((a, b) => b.post.date.localeCompare(a.post.date));
}

function KakaotechPostList({ entries }: { entries: BoardEntry[] }) {
  if (entries.length === 0) {
    return <p className="empty-state">카테부 태그가 붙은 글이 아직 없습니다.</p>;
  }

  return (
    <div className="post-list">
      {entries.map((entry) => (
        <PostCard collection={entry.collection} key={`${entry.collection}-${entry.post.slug}`} post={entry.post} />
      ))}
    </div>
  );
}

export default async function KakaotechBootcampPage({ searchParams }: PageProps) {
  const [posts, notes, projects] = await Promise.all([
    getCollection("blog"),
    getCollection("notes"),
    getCollection("projects"),
  ]);
  const { board, category, page } = await searchParams;
  const selectedBoard = getBoard(board);
  const entries = getEntries(selectedBoard, posts, notes, projects);
  const categories = getCategories(entries.map((entry) => entry.post));
  const categoryParam = getCategoryParam(category);
  const selectedCategory = categories.includes(categoryParam ?? "") ? categoryParam : undefined;
  const filteredEntries = selectedCategory
    ? entries.filter((entry) => entry.post.category === selectedCategory)
    : entries;
  const paginated = paginate(filteredEntries, getPageNumber(page));

  return (
    <section className="page-shell collection-page">
      <CollectionHero
        eyebrow="KakaoTech Bootcamp"
        iconSrc="/icons/katebu.webp"
        title="카카오테크 부트캠프 기록"
      />
      <nav className="category-filter" aria-label="Kakaotech boards">
        {boards.map((item) => (
          <a
            className={selectedBoard === item.value ? "active" : undefined}
            href={boardHref(item.value)}
            key={item.value}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <CategoryFilter
        basePath="/kakaotech-bootcamp"
        categories={categories}
        query={{ board: selectedBoard === "all" ? undefined : selectedBoard }}
        selectedCategory={selectedCategory}
      />
      <KakaotechPostList entries={paginated.items} />
      <Pagination
        basePath="/kakaotech-bootcamp"
        currentPage={paginated.currentPage}
        query={{
          board: selectedBoard === "all" ? undefined : selectedBoard,
          category: selectedCategory,
        }}
        totalPages={paginated.totalPages}
      />
    </section>
  );
}
