import { exists, readdir, rm } from "node:fs/promises";

import { atprotoLexicons } from "@/lexicons";

// clear lexicon dir

if (await exists("../../lexicons")) {
    const lexiconDir = await readdir("../../lexicons");

    for (const file of lexiconDir) {
        if (file !== "README.md") {
            await rm(`../../lexicons/${file}`, { recursive: true });
        }
    }
}

// write lexicons

const lexicons = atprotoLexicons.docs.values();

for (const lexicon of lexicons) {
    await Bun.write(
        `../../lexicons/${lexicon.id.split(".").join("/")}.json`,
        JSON.stringify(lexicon, null, 4),
    );
    console.log(`Wrote lexicon ${lexicon.id}`);
}

console.log("Done!");
