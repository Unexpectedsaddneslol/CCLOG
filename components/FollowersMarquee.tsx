import Image from "next/image";
import Reveal from "@/components/Reveal";

export type FollowerItem = {
  id: string;
  name: string;
  avatar: string;
  telegramUrl: string;
};

export default function FollowersMarquee({
  heading,
  items,
  mode,
  id,
}: {
  heading: string;
  items: FollowerItem[];
  mode: "preview" | "full";
  id?: string;
}) {
  const HeadingTag = mode === "full" ? "h1" : "h2";

  // With very few followers, duplicating the list just once (items+items)
  // makes both copies fit on screen at once, so the "loop" looks like a
  // static, obviously-repeating row instead of an actual marquee. Repeat
  // enough times that half the track comfortably exceeds a typical
  // viewport width before it needs to wrap. The animation shifts the track
  // by exactly -50%, so `repeats` must stay even — otherwise that shift
  // lands mid-copy instead of on an item-array boundary and the loop visibly
  // jumps/misaligns at the seam.
  let repeats = Math.ceil(16 / Math.max(items.length, 1));
  repeats = Math.ceil(repeats / 2) * 2;
  repeats = Math.min(10, Math.max(2, repeats));
  const loop = Array.from({ length: repeats }, () => items).flat();
  const halfLength = (items.length * repeats) / 2;

  return (
    <section id={id} className="section followers-section">
      <div className="followers-section__backdrop">
        <Image
          src="/assets/people/peoplev.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="container" style={{ position: "relative" }}>
        <Reveal>
          <div className="section-head section-head--center">
            <HeadingTag>{heading}</HeadingTag>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div
          className="marquee"
          style={{ "--marquee-duration": `${halfLength * 3}s` } as React.CSSProperties}
        >
          <div className="marquee__track">
            {loop.map((item, i) => (
              <a
                key={`${item.id}-${i}`}
                href={item.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="follower-circle"
                title={item.name}
              >
                <Image src={item.avatar} alt={item.name} fill sizes="108px" style={{ objectFit: "cover" }} />
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
