import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(dir, "..", "public", "assets", "followers");

const letters = ["A", "K", "V", "S", "M", "D", "N", "T", "L", "R", "P", "O"];

for (let i = 0; i < letters.length; i++) {
  const letter = letters[i];
  const invert = i % 2 === 0;
  const bg = invert ? "#000000" : "#ffffff";
  const fg = invert ? "#ffffff" : "#000000";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
<circle cx="100" cy="100" r="100" fill="${bg}"/>
<circle cx="100" cy="100" r="98" fill="none" stroke="${fg}" stroke-width="2"/>
<text x="100" y="128" font-family="Arial, sans-serif" font-size="88" font-weight="700" text-anchor="middle" fill="${fg}">${letter}</text>
</svg>`;
  writeFileSync(path.join(outDir, `f${i + 1}.svg`), svg, "utf8");
}

console.log(`Generated ${letters.length} follower avatars in ${outDir}`);
