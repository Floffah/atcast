import { NextRequest, NextResponse } from "next/server";

import { lexicons } from "@atcast/atproto";

import { xrpcRoutes } from "@/app/xrpc/[nsid]/routes";
import { AtprotoErrorResponse } from "@/lib/server/AtprotoErrorResponse";
import { JSONResponse } from "@/lib/server/JSONResponse";

const handler = async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname;
    const xrpcPath = decodeURIComponent(pathname.split("/xrpc/")[1]);
    const nsidSegments = xrpcPath.split("#");
    const nsid = nsidSegments[0];
    const procedureName = nsidSegments[1] ?? "main";

    const handler = xrpcRoutes[nsid];

    if (!handler) {
        return new AtprotoErrorResponse(
            {
                error: "InvalidNamespace",
            },
            {
                status: 404,
            },
        );
    }

    if (procedureName !== "main") {
        return new AtprotoErrorResponse(
            {
                error: "InvalidNamespace",
            },
            {
                status: 404,
            },
        );
    }

    const lex = lexicons.get(nsid);

    if (!lex) {
        return new AtprotoErrorResponse(
            {
                error: "InvalidNamespace",
            },
            {
                status: 404,
            },
        );
    }

    let input: any | undefined = undefined;
    let params: any | undefined = undefined;

    if (req.method === "POST") {
        if ("input" in lex.defs[procedureName]) {
            input = await req.json();

            try {
                input = lexicons.assertValidXrpcInput(xrpcPath, input);
            } catch (e: any) {
                return new JSONResponse(
                    {
                        error: "InvalidInput",
                        message: e.message,
                    },
                    {
                        status: 400,
                    },
                );
            }
        }
    } else {
        if ("params" in lex.defs[procedureName]) {
            const search = req.nextUrl.searchParams;

            params = {};

            for (const [key, value] of search) {
                params[key] = value;
            }

            try {
                params = lexicons.assertValidXrpcParams(xrpcPath, params);
            } catch (e: any) {
                return new JSONResponse(
                    {
                        error: "InvalidParams",
                        message: e.message,
                    },
                    {
                        status: 400,
                    },
                );
            }
        }
    }

    let response = new NextResponse("{}");

    try {
        response = await handler.main(params, input, req);
    } catch (error) {
        console.error(error);
    }

    return response;
};

export const GET = handler;
export const POST = handler;
