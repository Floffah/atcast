import { cacheLife } from "next/dist/server/use-cache/cache-life";

import { LiveAtcastPodcastShow, RecordNSIDs } from "@atcast/atproto";
import { db } from "@atcast/models";

import { createBskyClient } from "@/lib/api/bskyClient";
import { didResolver } from "@/lib/server/identity";

export async function getPublicShowData(id: string) {
    "use cache";
    cacheLife("show");

    const show = await db.query.shows.findFirst({
        where: (shows, { eq }) => eq(shows.publicId, id),
    });

    if (!show) {
        return null;
    }

    const showOwner = await db.query.showCollaborators.findFirst({
        where: (showCollaborators, { eq, and }) =>
            and(
                eq(showCollaborators.showId, show.id),
                eq(showCollaborators.type, "OWNER"),
            ),
    });

    const showOwnerUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, showOwner!.userId),
    });

    const diddoc = await didResolver.resolve(showOwnerUser!.did);

    if (!diddoc || !diddoc.service) {
        return null;
    }

    const serviceEndpoint = diddoc.service.find(
        (service) => service.type === "AtprotoPersonalDataServer",
    );

    if (
        !serviceEndpoint ||
        typeof serviceEndpoint.serviceEndpoint !== "string"
    ) {
        return null;
    }

    const client = createBskyClient({
        service: serviceEndpoint.serviceEndpoint,
    });

    const response = await client.com.atproto.repo.getRecord({
        repo: showOwnerUser!.did,
        collection: RecordNSIDs.SHOW,
        rkey: id,
    });

    if (!response.data.value) {
        return null;
    }

    return {
        ownerDid: showOwnerUser!.did,
        show: response.data.value as LiveAtcastPodcastShow.Record,
    };
}
