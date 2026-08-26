import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { getSiteSettings } from "@/lib/content";

export const metadata = { title: "Услуги — Контр-Культура" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header />
      <main>
        <section className="section">
          <div className="container">
            <Reveal>
              <div className="section-head section-head--center">
                <h1>Услуги проекта</h1>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rich-content rich-content--centered" dangerouslySetInnerHTML={{ __html: settings.servicesContent }} />
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
