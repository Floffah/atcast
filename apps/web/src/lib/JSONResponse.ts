import { NextResponse } from "next/server";

export class JSONResponse extends NextResponse {
    constructor(data: any, init: ResponseInit = {}) {
        super(JSON.stringify(data), {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...(init.headers ?? {}),
            },
        });
    }
}
