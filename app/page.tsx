import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PostSection from "@/components/PostSection";
import ListSection from "@/components/ListSection";
import ServiceRows from "@/components/ServiceRows";
import FollowersMarquee from "@/components/FollowersMarquee";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";
import {
  getArticles,
  getFollowers,
  getInvestigations,
  getPartners,
  getServices,
  getSiteSettings,
  getTools,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [investigations, articles, tools, services, partners, followers, settings] =
    await Promise.all([
      getInvestigations(3),
      getArticles(3),
      getTools(),
      getServices(),
      getPartners(),
      getFollowers(),
      getSiteSettings(),
    ]);

  return (
    <>
      <Header />
      <main>
        <Hero />

        <PostSection
          heading="Последние расследования"
          items={investigations}
          mode="preview"
          variant="cover"
          basePath="/investigations"
        />

        <PostSection
          heading="Последние статьи"
          items={articles}
          mode="preview"
          variant="word"
          basePath="/articles"
        />

        <ListSection
          id="tools"
          heading="Наши инструменты"
          items={tools.map((t) => ({ id: t.id, name: t.name, description: t.description, image: t.icon, url: t.url }))}
          mode="preview"
          centerHeading
          shiftHeadingRight
        />

        <FollowersMarquee id="followers" heading="Последователи" items={followers} mode="preview" />

        <ListSection
          id="partners"
          heading="Партнёры"
          items={partners.map((p) => ({ id: p.id, name: p.name, description: p.description, image: p.logo, url: p.url }))}
          mode="preview"
          centerHeading
        />

        <ServiceRows
          heading="Услуги"
          items={services.map((s) => ({ id: s.id, name: s.name, description: s.description, icon: s.icon }))}
          mode="preview"
        />

        <JoinSection
          id="join"
          qrImage={settings.qrImage}
          joinText={settings.joinText}
          telegramUrl={settings.telegramUrl}
          mode="preview"
        />
      </main>
      <Footer
        email={settings.email}
        telegramUrl={settings.telegramUrl}
        tiktokUrl={settings.tiktokUrl}
        youtubeUrl={settings.youtubeUrl}
      />
    </>
  );
}
