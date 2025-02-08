import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { fetchBskyOAS } from "@atcast/atproto";

export async function getBskyAuthInfo() {
    "use cache";
    cacheLife("wellKnown");

    return await fetchBskyOAS();
}
