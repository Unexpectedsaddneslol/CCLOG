import Image from "next/image";
import Reveal from "@/components/Reveal";

export type ListItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  url?: string;
};

// Pre-rendered glow templates (public/assets/backgroundTrmplates) replace
// the old procedurally-composited glow (radial-gradient "blob" masks over
// fingerprint-blotch.png) — 24 already-processed fingerprint textures,
// one picked per item and bound statically to it.
const GLOW_TEMPLATE_COUNT = 24;

// Deterministic string hash — not Math.random(), which would render
// differently on the server than the client and trigger a hydration
// mismatch, so each icon consistently lands on the same pick instead of
// reshuffling every render.
function hashSeed(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h ^ seed.charCodeAt(i)) * 2654435761;
    h = h ^ (h >>> 13);
  }
  return Math.abs(h);
}

function pickGlowTemplate(seed: string) {
  const index = hashSeed(seed) % GLOW_TEMPLATE_COUNT;
  return `/assets/backgroundTrmplates/turbseq2${String(index).padStart(5, "0")}.jpg`;
}

// One of 8 compass directions, picked per item (salted so it doesn't
// always land on the same side as the template pick above) — matches the
// old procedural version's "cataract" blob: an irregular black smudge
// eating into the fingerprint from a random side instead of a clean
// circular crop on every icon.
const COMPASS_POSITIONS = [
  { x: 50, y: 0 }, // север
  { x: 85, y: 15 }, // северо-восток
  { x: 100, y: 50 }, // восток
  { x: 85, y: 85 }, // юго-восток
  { x: 50, y: 100 }, // юг
  { x: 15, y: 85 }, // юго-запад
  { x: 0, y: 50 }, // запад
  { x: 15, y: 15 }, // северо-запад
];

function pickCataractPosition(seed: string) {
  const index = hashSeed(`${seed}:cataract`) % COMPASS_POSITIONS.length;
  return COMPASS_POSITIONS[index];
}

export default function ListSection({
  heading,
  items,
  mode,
  centerHeading = false,
  shiftHeadingRight = false,
  id,
}: {
  heading: string;
  items: ListItem[];
  mode: "preview" | "full";
  centerHeading?: boolean;
  shiftHeadingRight?: boolean;
  id?: string;
}) {
  const HeadingTag = mode === "full" ? "h1" : "h2";

  return (
    <section id={id} className="section">
      <div className="container">
        <Reveal>
          <div
            className={`section-head${centerHeading ? " section-head--center" : ""}`}
            style={shiftHeadingRight ? { transform: "translateX(1.5%)" } : undefined}
          >
            <HeadingTag>{heading}</HeadingTag>
          </div>
        </Reveal>

        <div className="list-rows">
          {items.map((item, i) => {
            const content = (
              <>
                <div className="list-row__icon-outer">
                  <div
                    className="list-row__icon-glow"
                    style={{ backgroundImage: `url(${pickGlowTemplate(item.id)})` }}
                  />
                  <div
                    className="list-row__icon-cataract"
                    style={(() => {
                      const { x, y } = pickCataractPosition(item.id);
                      return { background: `radial-gradient(ellipse 55% 55% at ${x}% ${y}%, black 0%, black 88%, transparent 100%)` };
                    })()}
                  />
                  <div className="list-row__icon-wrap">
                    <Image src={item.image} alt="" fill sizes="96px" style={{ objectFit: "cover" }} />
                  </div>
                </div>
                <p className="list-row__text">
                  <span className="list-row__name">{item.name}</span>
                  {item.description ? <> — {item.description}</> : null}
                </p>
              </>
            );
            return (
              <Reveal key={item.id} delay={Math.min(i * 0.04, 0.24)}>
                {item.url ? (
                  <a className="list-row" href={item.url} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : (
                  <div className="list-row">{content}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
