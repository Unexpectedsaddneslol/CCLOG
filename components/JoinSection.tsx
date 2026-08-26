import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function JoinSection({
  qrImage,
  joinText,
  telegramUrl,
  mode,
  id,
}: {
  qrImage: string;
  joinText: string;
  telegramUrl: string;
  mode: "preview" | "full";
  id?: string;
}) {
  const HeadingTag = mode === "full" ? "h1" : "h2";
  const qrSize = mode === "full" ? 540 : 450;
  const [linkText, ...restParts] = joinText.split(" — ");
  const rest = restParts.join(" — ");

  return (
    <section id={id} className="section">
      <div className="container container--wide">
        <Reveal>
          <div className="section-head section-head--center" style={{ marginBottom: 0, position: "relative", zIndex: 3 }}>
            <HeadingTag>Вступить к нам</HeadingTag>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="join-row">
            <div className="join-qr" style={{ width: qrSize, height: qrSize }}>
              <Image src={qrImage} alt="QR-код" fill sizes={`${qrSize}px`} style={{ objectFit: "cover" }} />
            </div>
            <p className="join-text">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="join-text-link"
                style={{ fontWeight: 700, color: "#fff" }}
              >
                {linkText}
              </a>
              {rest ? <> — {rest}</> : null}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
