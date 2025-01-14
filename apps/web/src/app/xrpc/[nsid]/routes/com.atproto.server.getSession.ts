import { parse } from "cookie";

import { ComAtprotoServerGetSession } from "@atcast/atproto";
import { SESSION_TOKEN } from "@atcast/lib";
import { db } from "@atcast/models";

import { XRPCHandler } from "@/app/xrpc/[nsid]/routes/index";
import { AtprotoErrorResponse } from "@/lib/server/AtprotoErrorResponse";
import { JSONResponse } from "@/lib/server/JSONResponse";
import { didResolver } from "@/lib/server/identity";

export const ComAtprotoServerGetSessionHandler: XRPCHandler<
    ComAtprotoServerGetSession.QueryParams,
    ComAtprotoServerGetSession.InputSchema,
    ComAtprotoServerGetSession.OutputSchema
> = {
    main: async (_, _1, req) => {
        if (!req.headers.has("authorization") && !req.headers.has("cookie")) {
            return new AtprotoErrorResponse(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                },
            );
        }

        const authHeader = req.headers.get("authorization");
        const cookieHeader = req.headers.get("cookie");

        let token: string | undefined = undefined;

        if (authHeader) {
            const parts = authHeader.split(" ");
            if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
                return new AtprotoErrorResponse(
                    {
                        error: "InvalidAuthorization",
                    },
                    {
                        status: 400,
                    },
                );
            }

            token = parts[1];
        } else if (cookieHeader) {
            const cookies = parse(cookieHeader);

            if (!(SESSION_TOKEN in cookies)) {
                return new AtprotoErrorResponse(
                    {
                        error: "InvalidAuthorization",
                    },
                    {
                        status: 400,
                    },
                );
            }

            token = cookies[SESSION_TOKEN];
        }

        if (!token) {
            return new AtprotoErrorResponse(
                {
                    error: "InvalidAuthorization",
                },
                {
                    status: 400,
                },
            );
        }

        const session = await db.query.userSessions.findFirst({
            where: (userSessions, { eq }) => eq(userSessions.token, token),
        });

        if (!session) {
            return new AtprotoErrorResponse(
                {
                    error: "InvalidToken",
                },
                {
                    status: 401,
                },
            );
        }

        const user = (await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, session.userId),
        }))!;

        const didDoc = await didResolver.resolve(user.did);

        return new JSONResponse({
            handle: user.name,
            did: user.did,
            email: user.email,
            emailConfirmed: false,
            emailAuthFactor: null,
            didDoc,
            active: true,
            status: null,
        });
    },
};
