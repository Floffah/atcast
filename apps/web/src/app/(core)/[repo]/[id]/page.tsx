import { AtUri } from "@atproto/api";
import stylex from "@stylexjs/stylex";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RecordNSIDs } from "@atcast/atproto";

import { AudioPlayerSection } from "@/app/(core)/[repo]/[id]/AudioPlayerSection";
import { EpisodeTitleSection } from "@/app/(core)/[repo]/[id]/EpisodeTitleSection";
import { EpisodeTitleSectionLoading } from "@/app/(core)/[repo]/[id]/EpisodeTitleSection/loading";
import { getEpisode } from "@/lib/server/data/getEpisode";
import { sizes } from "@/styles/sizes.stylex";

export default async function ShowPage({
    params,
}: {
    params: Promise<{ repo: string; id: string }>;
}) {
    const { repo, id } = await params;

    const uri = AtUri.make(decodeURIComponent(repo), RecordNSIDs.EPISODE, id);

    const episode = await getEpisode(uri);

    if (!episode) {
        return notFound();
    }

    return (
        <div {...stylex.props(styles.container)}>
            <Suspense fallback={<EpisodeTitleSectionLoading />}>
                <EpisodeTitleSection
                    uri={uri}
                    episode={episode.recordData.value}
                />
            </Suspense>

            <Suspense fallback={<EpisodeTitleSectionLoading />}>
                <AudioPlayerSection
                    uri={uri}
                    user={episode.user}
                    internalEpisode={episode.episode}
                />
            </Suspense>
        </div>
    );
}

const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: sizes.spacing2,
        gap: sizes.spacing4,
        marginTop: sizes.spacing4,
    },
});
