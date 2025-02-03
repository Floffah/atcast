import { ComAtprotoServerGetSession } from "@atcast/atproto";

import { XRPCHandler } from "@/app/xrpc/[nsid]/routes/index";
import { JSONResponse } from "@/lib/server/JSONResponse";
import { getSessionFromRequest } from "@/lib/server/data/getSession";
import { didResolver } from "@/lib/server/identity";

export const ComAtprotoServerGetSessionHandler: XRPCHandler<
    ComAtprotoServerGetSession.QueryParams,
    ComAtprotoServerGetSession.InputSchema,
    ComAtprotoServerGetSession.OutputSchema
> = {
    main: async (_, _1, req) => {
        const { errorResponse, user } = await getSessionFromRequest(req);

        if (errorResponse) {
            return errorResponse;
        }

        const didDoc = await didResolver.resolve(user.did);

        return new JSONResponse({
            handle: user.name,
            did: user.did,
            email: user.email ?? undefined,
            emailConfirmed: false,
            emailAuthFactor: undefined,
            didDoc,
            active: true,
            status: undefined,
        });
    },
};
