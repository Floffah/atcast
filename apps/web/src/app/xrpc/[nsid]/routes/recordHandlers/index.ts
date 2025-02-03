import { NextRequest } from "next/server";

import {
    ComAtprotoRepoCreateRecord,
    ComAtprotoRepoGetRecord,
} from "@atcast/atproto";
import { UserSession } from "@atcast/models";

import { LiveAtcastPodcastShowRecordHandler } from "@/app/xrpc/[nsid]/routes/recordHandlers/live.atcast.podcast.show";
import { AtprotoErrorResponse } from "@/lib/server/AtprotoErrorResponse";

export type CreateRecordHandler = (
    params: ComAtprotoRepoCreateRecord.QueryParams,
    input: ComAtprotoRepoCreateRecord.InputSchema,
    req: NextRequest,
    session: UserSession,
) => Promise<
    | {
          errorResponse: AtprotoErrorResponse;
          newInput: undefined;
      }
    | {
          errorResponse: undefined;
          newInput: ComAtprotoRepoCreateRecord.InputSchema;
      }
>;

export type GetRecordHandler = (
    params: ComAtprotoRepoGetRecord.QueryParams,
    req: NextRequest,
    session: UserSession,
) => Promise<{ errorResponse?: AtprotoErrorResponse }>;

export interface RecordHandler {
    create?: CreateRecordHandler;
    get?: GetRecordHandler;
}

export const recordHandlers: Record<string, RecordHandler> = {
    "live.atcast.podcast.show": LiveAtcastPodcastShowRecordHandler,
};
