import type { Metadata } from "next";
import { ArticleLayout } from "@/components/ArticleLayout";
import { getCollection, getPost } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost("blog", slug);
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost("blog", slug);

  return <ArticleLayout collection="blog" post={post} />;
}
