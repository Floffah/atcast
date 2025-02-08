import { recordHandlers } from "./recordHandlers";

import { ComAtprotoRepoCreateRecord, lexicons } from "@atcast/atproto";
import { retry } from "@atcast/lib";

import { XRPCHandler } from "@/app/xrpc/[nsid]/routes/index";
import { createPDSClient } from "@/lib/api/pdsClient";
import { AtprotoErrorResponse } from "@/lib/server/AtprotoErrorResponse";
import { JSONResponse } from "@/lib/server/JSONResponse";
import { getSessionFromRequest } from "@/lib/server/data/getSession";

export const ComAtprotoRepoCreateRecordHandler: XRPCHandler<
    ComAtprotoRepoCreateRecord.QueryParams,
    ComAtprotoRepoCreateRecord.InputSchema,
    ComAtprotoRepoCreateRecord.OutputSchema
> = {
    main: async (params, input, req) => {
        const { errorResponse, user, session } =
            await getSessionFromRequest(req);

        if (errorResponse) {
            return errorResponse;
        }

        if (input.repo !== user.did) {
            return new AtprotoErrorResponse({
                error: "InvalidRepo",
                message: "User does not have access to this repo",
            });
        }

        let inputRecord = input.record as any;

        if (!inputRecord || !inputRecord["$type"]) {
            return new AtprotoErrorResponse({
                error: "InvalidRecord",
                message: "Record must have a $type field",
            });
        }

        try {
            inputRecord = lexicons.assertValidRecord(
                inputRecord["$type"],
                inputRecord,
            );
        } catch (e: any) {
            return new AtprotoErrorResponse({
                error: "InvalidRecord",
                message: e.message,
            });
        }

        let createRecordInput = {
            ...input,
            record: inputRecord,
        };

        const recordHandler = recordHandlers[inputRecord["$type"]];

        if (recordHandler && recordHandler.create) {
            const { errorResponse, newInput } = await recordHandler.create(
                params,
                createRecordInput,
                req,
                session,
            );

            if (errorResponse) {
                return errorResponse;
            }

            createRecordInput = newInput;
        }

        const pds = await createPDSClient({
            session: session,
            did: user.did,
        });

        const response = await retry(
            async () => pds.com.atproto.repo.createRecord(createRecordInput),
            {
                retries: 2,
                allowError: (e) => e.message.includes("DPoP proof"),
            },
        );

        return new JSONResponse(response.data, {
            headers: response.headers as HeadersInit,
        });
    },
};
