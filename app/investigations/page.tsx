import Header from "@/components/Header";
import PostSection from "@/components/PostSection";
import { getInvestigations } from "@/lib/content";

export const metadata = { title: "Расследования — Контр-Культура" };
export const dynamic = "force-dynamic";

export default async function InvestigationsPage() {
  const investigations = await getInvestigations();

  return (
    <>
      <Header />
      <main>
        <PostSection heading="Расследования" items={investigations} mode="full" variant="cover" basePath="/investigations" />
      </main>
    </>
  );
}
