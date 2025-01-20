import { ComAtprotoServerGetSession } from "@atcast/atproto";
import { db } from "@atcast/models";

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
        const { errorResponse, session } = await getSessionFromRequest(req);

        if (errorResponse) {
            return errorResponse;
        }

        const user = (await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, session.userId),
        }))!;

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
