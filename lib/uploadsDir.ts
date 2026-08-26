import path from "node:path";

// Defaults to public/uploads for local dev (Next serves that statically,
// no extra wiring needed). On a host with a persistent volume that isn't
// mounted inside the app's own public/ folder (e.g. Railway), set
// UPLOADS_DIR to a path inside that volume — admin uploads otherwise land
// on the container's ephemeral filesystem and vanish on the next deploy,
// leaving DB records pointing at files that no longer exist.
export const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");
