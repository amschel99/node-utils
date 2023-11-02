import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts","src/seed.ts","tests/.test.js"],
  format: [ "esm"],
  dts: true, 
  splitting: false,
  sourcemap: true,
  clean: true,
});