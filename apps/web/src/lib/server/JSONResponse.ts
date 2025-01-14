import { NextResponse } from "next/server";

export class JSONResponse<Shape = any> extends NextResponse {
    shape: Shape = null!;

    constructor(data: Shape, init: ResponseInit = {}) {
        super(JSON.stringify(data), {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...(init.headers ?? {}),
            },
        });
    }
}
