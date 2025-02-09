import { clientMetadata } from "@atcast/atproto";

import { JSONResponse } from "@/lib/server/JSONResponse";

export const dynamic = "force-static";
export const dynamicParams = false;

export const GET = () => {
    return new JSONResponse(clientMetadata);
};
