import { NextSSRPlugin as UTNextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { connection } from "next/server";
import { extractRouterConfig } from "uploadthing/server";

import { utFileRouter } from "@/app/api/uploadthing/core";

export async function UTSSR() {
    await connection();

    return <UTNextSSRPlugin routerConfig={extractRouterConfig(utFileRouter)} />;
}
