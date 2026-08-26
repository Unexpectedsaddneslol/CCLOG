import { notFound } from "next/navigation";
import Header from "@/components/Header";
import DocumentDetail from "@/components/DocumentDetail";
import { getInvestigationBySlug } from "@/lib/content";

export default async function InvestigationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const investigation = await getInvestigationBySlug(slug);

  if (!investigation) notFound();

  return (
    <>
      <Header />
      <main>
        <DocumentDetail
          title={investigation.title}
          excerpt={investigation.excerpt}
          body={investigation.body}
          pdfFile={investigation.pdfFile}
        />
      </main>
    </>
  );
}
