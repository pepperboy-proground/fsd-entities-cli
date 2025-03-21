import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  outDir: "dist",
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: false,
  minify: true,
});
