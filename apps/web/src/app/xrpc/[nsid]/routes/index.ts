import { LexiconDoc } from "@atproto/lexicon";
import { NextRequest, NextResponse } from "next/server";

import { LiveAtcastAuthCreateSessionHandler } from "@/app/xrpc/[nsid]/routes/live.atcast.auth.createSession";

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
};
