import "@atproto/api";
import { IdResolver, getPds } from "@atproto/identity";

const id = new IdResolver();

const did = await id.handle.resolve("floffah.dev");

const diddoc = await id.did.resolve(did!);

console.log(diddoc);
console.log(await getPds(diddoc!));
