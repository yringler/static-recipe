// Base URL for recipe source images (scans of the original recipes), served
// from the "blog" R2 bucket under recipes/. Relative entries in a recipe's
// `sourceImages` are resolved against it; absolute URLs are used as-is.
// Override at build time with RECIPE_IMAGE_BASE_URL.
export default {
  imageBaseUrl: process.env.RECIPE_IMAGE_BASE_URL ?? "https://assets.yehudardevelopment.com/recipes/",
};
