// Base URL for recipe source images (scans of the original recipes).
// Relative entries in a recipe's `sourceImages` are resolved against it;
// absolute URLs are used as-is. Override at build time with RECIPE_IMAGE_BASE_URL.
// TODO: replace the default with the R2 bucket's public URL once it is set up.
export default {
  imageBaseUrl: process.env.RECIPE_IMAGE_BASE_URL ?? "https://recipe-images.yehudardevelopment.com/",
};
