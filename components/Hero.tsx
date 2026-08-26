"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  // Plain scroll listener + rAF, not framer-motion and not a CSS
  // scroll-timeline — tried both. framer-motion's useScroll was smooth on
  // desktop but real phones measured ~10fps (the site's non-standard
  // html{zoom} is a known-bad combination with JS-computed scroll
  // transforms on mobile Safari/Chrome). Rewriting it as a CSS
  // animation-timeline/view-timeline fixed that, but real testers then
  // hit it simply not animating at all on mobile Safari and the Zen
  // in-app browser (desktop) — CSS.supports("animation-timeline: --x")
  // reported the syntax as understood on both, but that only confirms
  // parsing, not that the scroll-driven-animations implementation is
  // complete; both engines' support is new enough to have real gaps. A
  // scroll listener is old enough to be reliable everywhere, so it's
  // back — but keeping mobile to a cheap translateY-only animation
  // (matches the 18%-cap math already proven gap-free at the container's
  // fixed -20%/150% overscan) instead of the desktop's fuller
  // translate+scale keeps the per-frame cost low specifically where the
  // lag was actually measured. offsetHeight (not getBoundingClientRect)
  // against window.scrollY keeps both reads in the same real/unzoomed px
  // space — mixing zoomed getBoundingClientRect with unzoomed scrollY is
  // what caused the original range-too-short bug, elsewhere in this
  // project's history.
  useEffect(() => {
    const section = sectionRef.current;
    const layer = layerRef.current;
    if (!section || !layer) return;

    const mq = window.matchMedia("(max-width: 700px)");
    let ticking = false;
    const update = () => {
      ticking = false;
      const h = section.offsetHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / h, 0), 1);
      if (mq.matches) {
        layer.style.transform = `translateY(${progress * 18}%)`;
      } else {
        layer.style.transform = `translateY(${progress * 55}%) scale(${1 + progress * 0.3})`;
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", update);
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-section" style={{ position: "relative", overflow: "hidden", background: "#000" }}>
      <div
        ref={layerRef}
        className="hero-parallax-layer"
        style={{
          position: "absolute",
          // Extends past the section on every side so the translate/scale
          // range in globals.css's hero-parallax keyframes never runs out
          // of image and exposes the section's black background at an
          // edge (was happening at the bottom).
          top: "-20%",
          left: 0,
          right: 0,
          height: "150%",
        }}
      >
        <Image src="/assets/main/hero-detail.jpg" alt="" fill priority sizes="100vw" className="hero-image" />
      </div>
      <div className="hero-dim" aria-hidden="true" />

      <div
        className="hero-heading-wrap"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container container--wide" style={{ textAlign: "center" }}>
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(38px, 7.5vw, 118px)",
            }}
          >
            Контр-Культура — находим и учимся
          </h1>
        </div>
      </div>
    </section>
  );
}
