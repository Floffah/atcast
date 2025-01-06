import { $, Glob } from "bun";
import { resolve } from "path";

const rootDir = resolve(__dirname, "../../..");
const glob = new Glob("lexicons/**/*.json");

const files: string[] = [];

for await (const file of glob.scan(rootDir)) {
    files.push(resolve(rootDir, file));
}

await $`lex gen-api codegen ${files} --yes`;
