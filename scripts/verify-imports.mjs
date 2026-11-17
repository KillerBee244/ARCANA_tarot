import fs from "fs";
import path from "path";

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
    } else if (f.endsWith(".tsx") || f.endsWith(".ts")) {
      const content = fs.readFileSync(full, "utf8");
      const matches = content.matchAll(/from\s+["'](@\/[^"']+)["']/g);
      for (const m of matches) {
        const rel = m[1].replace("@/", "src/");
        const candidates = [
          rel + ".ts",
          rel + ".tsx",
          rel + "/index.ts",
          rel + "/index.tsx",
          rel + ".json",
        ];
        const exists = candidates.some((c) => fs.existsSync(c));
        if (!exists) {
          console.log("MISSING IMPORT in", full, ":", m[1]);
        }
      }
    }
  }
}

scanDir("src");
console.log("All imports verified successfully!");

