import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { truncate } from "@/lib/text";

const PREVIEW_EXCERPT_LIMIT = { cover: 160, coverSmall: 70, word: 95 };

export type PostItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  contentSnippet?: string;
};

export default function PostSection({
  heading,
  items,
  mode,
  variant,
  basePath,
  centerHeading = false,
}: {
  heading: string;
  items: PostItem[];
  mode: "preview" | "full";
  variant: "cover" | "word";
  basePath: string;
  centerHeading?: boolean;
}) {
  const HeadingTag = mode === "full" ? "h1" : "h2";
  const gridClass = variant === "cover" ? "post-grid post-grid--bento" : "post-grid post-grid--triple";

  return (
    <section className="section">
      <div className="container container--wide">
        <Reveal>
          <div className={`section-head${mode === "full" || centerHeading ? " section-head--center" : ""}`}>
            <HeadingTag>{heading}</HeadingTag>
          </div>
        </Reveal>

        {mode === "full" ? (
          <div className="report-list">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i * 0.05, 0.3)}>
                <Link className="report-row" href={`${basePath}/${item.slug}`}>
                  <div className="report-row__image">
                    <Image src={item.coverImage} alt="" fill sizes="(max-width: 700px) 100vw, 40vw" style={{ objectFit: "cover" }} />
                  </div>
                  <div className="report-row__text">
                    <p className="report-row__title">
                      {item.title}.{item.excerpt ? ` ${item.excerpt}` : ""}
                    </p>
                    {item.contentSnippet && <p className="report-row__excerpt">{item.contentSnippet}</p>}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1}>
            <div className={gridClass}>
              {items.map((item, i) => (
                <Link className="post-cell" key={item.id} href={`${basePath}/${item.slug}`}>
                  <p className="post-cell__caption">
                    {variant === "cover" ? (
                      <>
                        <b>{item.title}</b>{" "}
                        {truncate(item.excerpt, i === 0 ? PREVIEW_EXCERPT_LIMIT.cover : PREVIEW_EXCERPT_LIMIT.coverSmall)}
                      </>
                    ) : (
                      <b>{item.title}</b>
                    )}
                  </p>
                  <div className="post-cell__frame">
                    <Image
                      src={item.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 100vw, 50vw"
                      className="post-cell__image"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
