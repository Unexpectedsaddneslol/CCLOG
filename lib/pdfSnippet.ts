import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import { UPLOADS_DIR } from "@/lib/uploadsDir";

// Extracts a short plain-text preview from a PDF's first few pages for the
// investigations/articles list pages — those need "a bit of the actual
// content" regardless of whether that content is a PDF or rich-text body,
// so this mirrors truncate()'s job but for PDF files server-side.
//
// Reads the first 3 pages rather than just page 1: several of the actual
// report PDFs open with a cover/title page that's little more than a
// heading and a "1 of N" footer, which made single-page extraction produce
// a near-empty, useless snippet — pulling a few pages in gives truncate()
// enough real body text to work with even when page 1 is mostly a cover.
//
// Uses pdf-parse (a thin wrapper over pdfjs-dist). Both packages must stay
// in next.config.ts's serverExternalPackages — pdfjs's own Node "fake
// worker" setup does a dynamic import of pdf.worker.mjs relative to itself,
// which Turbopack's SSR bundle can't resolve (the worker file isn't copied
// into .next/dev/server/chunks/ssr) and fails silently on every PDF unless
// the package is loaded via real Node `require` instead of being bundled.
export async function getPdfTextSnippet(pdfUrl: string, maxWords = 60): Promise<string> {
  let parser: PDFParse | undefined;
  try {
    const filePath = path.join(UPLOADS_DIR, path.basename(pdfUrl));
    const buffer = await readFile(filePath);
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText({ first: 3 });
    const text = result.text.replace(/\s+/g, " ").trim();

    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return `${words.slice(0, maxWords).join(" ")}…`;
  } catch (err) {
    console.error("getPdfTextSnippet failed for", pdfUrl, err);
    return "";
  } finally {
    await parser?.destroy();
  }
}
