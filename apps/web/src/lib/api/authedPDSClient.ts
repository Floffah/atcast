import { cache } from "react";

import { createPDSClient } from "@/lib/api/pdsClient";
import { getSessionFromRuntime } from "@/lib/server/data/getSession";

export const createPDSClientFromRuntime = cache(async () => {
    const { errorResponse, session, user } = await getSessionFromRuntime();

    if (errorResponse) {
        return { errorResponse };
    }

    return {
        client: await createPDSClient({
            session,
            did: user.did,
        }),
        session,
        user,
    };
});
