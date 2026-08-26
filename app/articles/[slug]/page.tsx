import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ArticleDetail from "@/components/ArticleDetail";
import { getArticleBySlug } from "@/lib/content";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <>
      <Header />
      <main>
        <ArticleDetail title={article.title} body={article.body} pdfFile={article.pdfFile} />
      </main>
    </>
  );
}
