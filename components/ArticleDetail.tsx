import Reveal from "@/components/Reveal";

export default function ArticleDetail({
  title,
  body,
  pdfFile,
}: {
  title: string;
  body: string;
  pdfFile: string;
}) {
  return (
    <section className="section section--white-theme">
      <div className="white-theme-backdrop" aria-hidden="true" />
      <div className="container">
        <Reveal>
          <div className="section-head">
            <h1>{title}</h1>
          </div>
        </Reveal>

        {body && (
          <Reveal delay={0.1}>
            <div className="rich-content" dangerouslySetInnerHTML={{ __html: body }} />
          </Reveal>
        )}

        {pdfFile && (
          <Reveal delay={0.15}>
            <a
              href={pdfFile}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", marginTop: body ? 24 : 0, fontSize: 14, textDecoration: "underline" }}
            >
              Скачать PDF
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
