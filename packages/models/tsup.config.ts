import { defineConfig } from "tsup";

export default defineConfig({
    name: "models",
    outDir: "dist",
    entry: ["./src/index.ts"],
    target: ["node20"],
    bundle: true,
    format: ["cjs", "esm"],
    dts: true,
    clean: false,
    sourcemap: true,
});
