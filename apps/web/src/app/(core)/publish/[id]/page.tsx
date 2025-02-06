import { AtUri } from "@atproto/api";
import { notFound, redirect } from "next/navigation";

import { RecordNSIDs } from "@atcast/atproto";

import { UploadForm } from "@/app/(core)/publish/[id]/UploadForm";
import { getEpisode } from "@/lib/server/data/getEpisode";
import { getSessionFromRuntime } from "@/lib/server/data/getSession";

export default async function UploadPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { user, errorResponse } = await getSessionFromRuntime();

    if (errorResponse) {
        return redirect("/login");
    }

    const { id } = await params;

    const uri = AtUri.make(user.did, RecordNSIDs.EPISODE, id);

    const episode = await getEpisode(uri);

    if (!episode) {
        return notFound();
    }

    return <UploadForm url={uri.toString()} />;
}
