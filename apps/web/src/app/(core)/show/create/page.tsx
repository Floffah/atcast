import { redirect } from "next/navigation";

import { CreateShowForm } from "@/app/(core)/show/create/CreateShowForm";
// import { createPdsClient } from "@/lib/api/pdsClient";
import { getSessionFromRuntime } from "@/lib/server/data/getSession";

export default async function CreateShowPage() {
    const session = await getSessionFromRuntime();

    if (!session.session) {
        return redirect("/");
    }

    // const pds = await createPdsClient({
    //     did: "did:plc:kmg6tabm3yygxez4e3q3cd3o",
    //     session: session.session,
    // });
    //
    // await pds.com.atproto.repo.deleteRecord({
    //     repo: "did:plc:kmg6tabm3yygxez4e3q3cd3o",
    //     collection: "live.atcast.podcast.show",
    //     rkey: "YvDHnRb3B5a6qPS_-DAx0",
    // })

    return <CreateShowForm />;
}
