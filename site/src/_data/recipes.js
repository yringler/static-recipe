import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const recipesDir = join(__dirname, "../recipes");

export default function () {
  const files = readdirSync(recipesDir).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      const raw = readFileSync(join(recipesDir, file), "utf-8");
      return JSON.parse(raw);
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}
