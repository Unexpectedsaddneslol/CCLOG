import Image from "next/image";

// Overlay positions measured directly from the baked panel image
// (public/assets/lowpanel/photo_2026-08-18_05-00-18.jpg, 1160x733) —
// icon centers and the email text's bounding box, as % of the image.
const ICONS = [
  { key: "telegram", xPct: 22.2, yPct: 27.7, label: "Telegram" },
  { key: "tiktok", xPct: 49.6, yPct: 27.4, label: "TikTok" },
  { key: "youtube", xPct: 76.5, yPct: 27.2, label: "YouTube" },
] as const;

export default function Footer({
  email,
  telegramUrl,
  tiktokUrl,
  youtubeUrl,
}: {
  email: string;
  telegramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
}) {
  const urls: Record<(typeof ICONS)[number]["key"], string> = {
    telegram: telegramUrl,
    tiktok: tiktokUrl,
    youtube: youtubeUrl,
  };

  return (
    <footer className="section" style={{ paddingTop: "clamp(12px, 2vw, 24px)", paddingBottom: 0, marginBottom: -8 }}>
      <div className="container">
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 250,
            margin: "0 auto",
            aspectRatio: "1160 / 733",
            containerType: "inline-size",
          }}
        >
          <Image
            src="/assets/lowpanel/photo_2026-08-18_05-00-18.jpg"
            alt=""
            fill
            sizes="1024px"
            style={{ objectFit: "contain" }}
          />

          {ICONS.map((icon) => (
            <a
              key={icon.key}
              href={urls[icon.key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={icon.label}
              style={{
                position: "absolute",
                left: `${icon.xPct}%`,
                top: `${icon.yPct}%`,
                width: "14%",
                height: "19%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {/* Patch over the baked-in email text so only the real,
              selectable/copyable text below shows. */}
          <div
            style={{
              position: "absolute",
              left: "15%",
              top: "75%",
              width: "70%",
              height: "12%",
              background: "#000",
            }}
          />
          <a
            href={`mailto:${email}`}
            className="mono"
            style={{
              position: "absolute",
              left: "49.5%",
              top: "77.8%",
              transform: "translateX(-50%)",
              fontSize: "4.1cqw",
              letterSpacing: "0.01em",
              color: "#fff",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {email}
          </a>
        </div>
      </div>
    </footer>
  );
}
