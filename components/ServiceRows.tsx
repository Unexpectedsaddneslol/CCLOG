import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export default function ServiceRows({
  heading,
  items,
  mode,
}: {
  heading: string;
  items: ServiceItem[];
  mode: "preview" | "full";
}) {
  const HeadingTag = mode === "full" ? "h1" : "h2";

  return (
    <section className="section">
      <div className="container container--wide container--wide-bounded">
        <Reveal>
          <div className="section-head section-head--center">
            <HeadingTag>{heading}</HeadingTag>
          </div>
        </Reveal>

        <div className="service-rows">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={Math.min(i * 0.06, 0.3)}>
              <div className={`service-row${i % 2 === 1 ? " service-row--reversed" : ""}`}>
                <div className="service-row__text">
                  <p className="service-row__desc">
                    <span className="service-row__name">{item.name}</span>
                    {item.description ? <> — {item.description}</> : null}
                  </p>
                </div>
                <Link
                  href="/services"
                  className={`service-row__image-wrap service-row__image-wrap--${i % 2 === 1 ? "left" : "right"}${item.icon.includes("sim") ? " service-row__image-wrap--sim" : " service-row__image-wrap--big"}`}
                >
                  <Image src={item.icon} alt="" fill sizes="560px" style={{ objectFit: "contain" }} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
