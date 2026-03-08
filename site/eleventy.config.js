import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  // Collection: recipes grouped by category (sorted alpha within each group)
  eleventyConfig.addCollection("recipesByCategory", function () {
    const recipesDir = join(__dirname, "src/recipes");
    const files = readdirSync(recipesDir).filter((f) => f.endsWith(".json"));
    const recipes = files
      .map((file) => JSON.parse(readFileSync(join(recipesDir, file), "utf-8")))
      .sort((a, b) => a.title.localeCompare(b.title));

    const grouped = {};
    for (const recipe of recipes) {
      if (!grouped[recipe.category]) grouped[recipe.category] = [];
      grouped[recipe.category].push(recipe);
    }
    return Object.keys(grouped)
      .sort()
      .map((category) => ({ category, recipes: grouped[category] }));
  });

  // Collection: all unique tags (sorted)
  eleventyConfig.addCollection("allTags", function () {
    const recipesDir = join(__dirname, "src/recipes");
    const files = readdirSync(recipesDir).filter((f) => f.endsWith(".json"));
    const tagSet = new Set();
    for (const file of files) {
      const recipe = JSON.parse(readFileSync(join(recipesDir, file), "utf-8"));
      if (recipe.tags) recipe.tags.forEach((t) => tagSet.add(t));
    }
    return [...tagSet].sort();
  });

  // Filter: get recipes for a specific tag
  eleventyConfig.addFilter("recipesForTag", function (tag) {
    const recipesDir = join(__dirname, "src/recipes");
    const files = readdirSync(recipesDir).filter((f) => f.endsWith(".json"));
    return files
      .map((file) => JSON.parse(readFileSync(join(recipesDir, file), "utf-8")))
      .filter((r) => r.tags && r.tags.includes(tag))
      .sort((a, b) => a.title.localeCompare(b.title));
  });

  // Filter: format ISO 8601 duration as human-readable
  eleventyConfig.addFilter("formatDuration", function (iso) {
    if (!iso) return "";
    const match = iso.match(/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/);
    if (!match) return iso;
    const [, days, hours, minutes, seconds] = match;
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds) parts.push(`${seconds}s`);
    return parts.join(" ") || iso;
  });

  // Filter: format temperature object
  eleventyConfig.addFilter("formatTemp", function (temp) {
    if (!temp) return "";
    return `${temp.value}°${temp.unit}`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "html", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
