try {
  require("./src/index.js");
} catch (error) {
  console.error("FATAL ERROR:", error);
  process.exit(1);
}
