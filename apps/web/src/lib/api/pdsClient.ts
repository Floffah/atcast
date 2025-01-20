import { createBskyClient } from "@/lib/api/bskyClient";
import {
    CreateDPopFetchOptions,
    createDpopFetch,
} from "@/lib/server/dpopFetch";
import { didResolver } from "@/lib/server/identity";

export async function createPdsClient(
    options: CreateDPopFetchOptions & {
        did: string;
    },
) {
    const atprotoData = await didResolver.resolveAtprotoData(options.did);

    return createBskyClient({
        service: atprotoData.pds,
        fetch: createDpopFetch(options),
    });
}
