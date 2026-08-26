import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const headingFont = localFont({
  src: "../public/fonts/ArialNova-Light.ttf",
  variable: "--font-heading",
  weight: "300",
  display: "swap",
});

const arialNovaCond = localFont({
  src: [
    { path: "../public/fonts/ArialNovaCond.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/ArialNovaCond-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

const cartographMono = localFont({
  src: "../public/fonts/ArialMonoMTProRegular.ttf",
  variable: "--font-cartograph-mono",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Контр-Культура",
  description: "Контр-Культура — находим и учимся. OSINT-расследования, статьи и инструменты.",
  robots: {
    index: true,
    follow: true,
  },
};

// viewportFit:"cover" + themeColor:"#000" let the page's own black extend
// under the notch/status-bar area instead of the OS falling back to its
// own (usually white) chrome color there — most visible in in-app
// browsers like Telegram's, which was the actual report. Pinch-zoom
// blocking (maximumScale/userScalable + a touchmove/gesturestart script)
// was tried and reverted — it was masking a real horizontal-overflow bug
// on mobile instead of fixing it; see the actual overflow fix elsewhere
// in this diff.
export const viewport: Viewport = {
  width: "device-width",
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${headingFont.variable} ${arialNovaCond.variable} ${cartographMono.variable}`}
    >
      <body>
        {/* Generated grain used across the site (icon shadows, section
            backgrounds) — a real CSS effect (feTurbulence), not a repeated
            noise.png. 0x0 + aria-hidden: never rendered on its own, only
            referenced via filter: url(#site-grain). */}
        <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
          <filter id="site-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch" result="grain" />
            <feColorMatrix
              in="grain"
              type="matrix"
              values="0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0    0    0    1 0"
            />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  );
}
