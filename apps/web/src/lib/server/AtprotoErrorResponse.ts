import { JSONResponse } from "@/lib/server/JSONResponse";

export class AtprotoErrorResponse extends JSONResponse {
    constructor(
        data: {
            error: string;
            message?: string;
        },
        init: ResponseInit = {},
    ) {
        super(data, {
            status: 500,
            ...init,
        });
    }
}
