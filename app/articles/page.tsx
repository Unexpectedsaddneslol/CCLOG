import Header from "@/components/Header";
import PostSection from "@/components/PostSection";
import { getArticles } from "@/lib/content";

export const metadata = { title: "Статьи — Контр-Культура" };
export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <Header />
      <main>
        <PostSection heading="Статьи" items={articles} mode="full" variant="word" basePath="/articles" />
      </main>
    </>
  );
}
