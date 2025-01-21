import { NextRequest } from "next/server";

import { ComAtprotoRepoCreateRecordHandler } from "@/app/xrpc/[nsid]/routes/com.atproto.repo.createRecord";
import { ComAtprotoServerGetSessionHandler } from "@/app/xrpc/[nsid]/routes/com.atproto.server.getSession";
import { LiveAtcastAuthCreateSessionHandler } from "@/app/xrpc/[nsid]/routes/live.atcast.auth.createSession";
import { LiveAtcastAuthGetAuthUrlHandler } from "@/app/xrpc/[nsid]/routes/live.atcast.auth.getAuthUrl";
import { AtprotoErrorResponse } from "@/lib/server/AtprotoErrorResponse";
import { JSONResponse } from "@/lib/server/JSONResponse";

type XRPCResponse<ResponseType> =
    | JSONResponse<ResponseType>
    | AtprotoErrorResponse;

export interface XRPCHandler<Params, Input, Response> {
    main: (
        params: Params,
        input: Input,
        req: NextRequest,
    ) => XRPCResponse<Response> | Promise<XRPCResponse<Response>>;
}

export const xrpcRoutes: Record<string, XRPCHandler<any, any, any>> = {
    "com.atproto.repo.createRecord": ComAtprotoRepoCreateRecordHandler,
    "com.atproto.server.getSession": ComAtprotoServerGetSessionHandler,

    "live.atcast.auth.createSession": LiveAtcastAuthCreateSessionHandler,
    "live.atcast.auth.getAuthUrl": LiveAtcastAuthGetAuthUrlHandler,
};
