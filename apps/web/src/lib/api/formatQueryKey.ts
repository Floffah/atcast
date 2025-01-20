import { schemas as bskySchemas } from "@atproto/api";

import { schemas } from "@atcast/atproto";

export function formatAPIQueryKey<
    Endpoint extends (typeof schemas)[number]["id"],
>(endpoint: Endpoint, input: any = {}) {
    return ["at://atcast.live", endpoint, input];
}

export function formatBskyQueryKey<
    Endpoint extends (typeof bskySchemas)[number]["id"],
>(endpoint: Endpoint, input: any = {}) {
    return ["at://bsky.social", endpoint, input];
}
