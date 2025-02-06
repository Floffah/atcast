import { ComAtprotoRepoGetRecord } from "@atcast/atproto";

import { XRPCHandler } from "@/app/xrpc/[nsid]/routes/index";
import { recordHandlers } from "@/app/xrpc/[nsid]/routes/recordHandlers";
import { createPDSClient } from "@/lib/api/pdsClient";
import { retry } from "@/lib/api/retry";
import { AtprotoErrorResponse } from "@/lib/server/AtprotoErrorResponse";
import { JSONResponse } from "@/lib/server/JSONResponse";
import { getSessionFromRequest } from "@/lib/server/data/getSession";

export const ComAtprotoRepoGetRecordHandler: XRPCHandler<
    ComAtprotoRepoGetRecord.QueryParams,
    ComAtprotoRepoGetRecord.InputSchema,
    ComAtprotoRepoGetRecord.OutputSchema
> = {
    main: async (params, _, req) => {
        const { errorResponse, user, session } =
            await getSessionFromRequest(req);

        if (errorResponse) {
            return errorResponse;
        }

        // We are resolving data from this user's specific PDS - to get other users, use a generic bsky or atproto client
        if (params.repo !== user.did) {
            return new AtprotoErrorResponse({
                error: "InvalidRepo",
                message: "User does not have access to this repo",
            });
        }

        const recordHandler = recordHandlers[params.collection];

        if (recordHandler && recordHandler.get) {
            const { errorResponse } = await recordHandler.get(
                params,
                req,
                session,
            );

            if (errorResponse) {
                return errorResponse;
            }
        }

        const pds = await createPDSClient({
            session: session,
            did: user.did,
        });

        const response = await retry(
            async () => pds.com.atproto.repo.getRecord(params),
            {
                retries: 2,
                allowError: (e) => e.message.includes("DPoP proof"),
            },
        );

        return new JSONResponse(response.data, {
            headers: response.headers as HeadersInit,
        });
    },
};
