import { CollectionHero } from "@/components/CollectionHero";
import { Pagination } from "@/components/Pagination";
import { PostList } from "@/components/PostList";
import { getCategoryParam } from "@/lib/categories";
import { getCollection } from "@/lib/content";
import { getPageNumber, paginate } from "@/lib/pagination";

const topics = [
  { value: "all", label: "All", tags: ["취미", "커피", "Coffee", "coffee", "키보드", "Keyboard", "keyboard"] },
  { value: "coffee", label: "커피", tags: ["커피", "Coffee", "coffee"] },
  { value: "keyboard", label: "키보드", tags: ["키보드", "Keyboard", "keyboard"] },
] as const;

type Topic = (typeof topics)[number]["value"];

type PageProps = {
  searchParams: Promise<{ page?: string | string[]; topic?: string | string[] }>;
};

export const metadata = {
  title: "이것저것",
};

function getTopic(value: string | string[] | undefined): Topic {
  const topic = getCategoryParam(value);
  return topics.some((item) => item.value === topic) ? (topic as Topic) : "all";
}

function hasAnyTag(postTags: string[], tags: readonly string[]) {
  return postTags.some((tag) => tags.includes(tag.trim()));
}

function topicHref(topic: Topic) {
  return topic === "all" ? "/hobby" : `/hobby?topic=${topic}`;
}

export default async function HobbyPage({ searchParams }: PageProps) {
  const posts = await getCollection("blog");
  const { page, topic } = await searchParams;
  const selectedTopic = getTopic(topic);
  const selectedTags = topics.find((item) => item.value === selectedTopic)?.tags ?? topics[0].tags;
  const filteredPosts = posts.filter((post) => hasAnyTag(post.tags, selectedTags));
  const paginated = paginate(filteredPosts, getPageNumber(page));

  return (
    <section className="page-shell collection-page">
      <CollectionHero eyebrow="Hobby" iconSrc="/icons/icon_hobby.png" title="이것저것" />
      <nav className="category-filter" aria-label="Hobby topics">
        {topics.map((item) => (
          <a
            className={selectedTopic === item.value ? "active" : undefined}
            href={topicHref(item.value)}
            key={item.value}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <PostList posts={paginated.items} collection="blog" />
      <Pagination
        basePath="/hobby"
        currentPage={paginated.currentPage}
        query={{ topic: selectedTopic === "all" ? undefined : selectedTopic }}
        totalPages={paginated.totalPages}
      />
    </section>
  );
}
