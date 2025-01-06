import { LexiconDoc } from "@atproto/lexicon";
import { NextRequest, NextResponse } from "next/server";

import { LiveAtcastAuthCreateSessionHandler } from "@/app/xrpc/[nsid]/routes/live.atcast.auth.createSession";
import { LiveAtcastAuthGetAuthUrlHandler } from "@/app/xrpc/[nsid]/routes/live.atcast.auth.getAuthUrl";

export type XRPCHandler<Lex extends LexiconDoc> = Partial<
    Record<
        keyof Lex["defs"],
        (
            params: any,
            input: any,
            req: NextRequest,
        ) => NextResponse | Promise<NextResponse>
    >
>;

export const xrpcRoutes: Record<string, XRPCHandler<any>> = {
    "live.atcast.auth.createSession": LiveAtcastAuthCreateSessionHandler,
    "live.atcast.auth.getAuthUrl": LiveAtcastAuthGetAuthUrlHandler,
};
